import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WebSocketService } from '../services/realchat/web-socket.service';
import { UserStorageService } from '../services/storage/user-storage.service';
import { UserDetails } from '../models/user.model';
import { AuthService } from '../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { ChatMessage } from '../models/chatMessages.model';
import { AppointmentsService } from '../services/appointments/appointments.service';
import { Appointment } from '../models/appointment.model';

@Component({
  selector: 'app-real-time-chat',
  templateUrl: './real-time-chat.component.html',
  styleUrls: ['./real-time-chat.component.css'],
})
export class RealTimeChatComponent implements OnInit {
  allUsers: UserDetails[] = [];
  newMessage = '';
  chatMessages: ChatMessage[] = [];
  sender = '';
  senderId: number;
  receiver = '';
  receiverId: number;
  appointments: Appointment[] = [];
  userRole: string = '';
  appointmentsMessage: string = '';
  messageOptions: { [key: number]: boolean } = {};
  isRecording: boolean = false;
  recognition: any;
  constructor(
    private webSocketService: WebSocketService,
    private userStorageService: UserStorageService,
    private authService: AuthService,
    private httpClient: HttpClient,
    private appointmentService: AppointmentsService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.webSocketService.connect();

    this.userStorageService.user$.subscribe((user) => {
      if (user && user.userId) {
        this.senderId = user.userId;
        this.sender = user.name;
        this.userRole = user.role;
        this.getAllUsers();
      }
    });

    // Listen for new messages
    this.webSocketService.currentMessage.subscribe((message) => {
      if (message?.id) {
        this.chatMessages.push(message);
        this.cdRef.detectChanges();
      }
    });

    // Listen for message deletions
    this.webSocketService.deletedMessage.subscribe((messageId) => {
      if (messageId) {
        this.chatMessages = this.chatMessages.filter(
          (msg) => msg.id !== messageId
        );
        this.cdRef.detectChanges();
      }
    });

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        this.newMessage = event.results[0][0].transcript; // ✅ Update userMessage instead of userInput
        this.cdRef.detectChanges();
      };

      this.recognition.onend = () => {
        this.isRecording = false;
      };
    }
  }

  startRecording() {
    if (this.recognition) {
      this.isRecording = true;
      this.recognition.start();
    }
  }

  getAllUsers(): void {
    this.authService.getAllUsers().subscribe(
      (data) => {
        this.allUsers = data.filter(
          (user) => user.id !== this.senderId && user.role !== 'ADMIN'
        );
        console.log(this.allUsers);
        if (this.userRole === 'PATIENT') {
          this.loadPatientsAppointments();
        } else if (this.userRole === 'DOCTOR') {
          this.loadDoctorsAppointments();
        }
      },
      (error) => console.error('Failed to retrieve users:', error)
    );
  }

  loadDoctorsAppointments() {
    this.appointmentService.getAppointmentsForDoctor(this.senderId).subscribe(
      (data) => {
        this.appointments = data.filter((app) => app.status === 'ACCEPTED');
        this.allUsers = this.allUsers.filter((user) =>
          this.appointments.some((app) => app.patient.email === user.email)
        );
      },
      (error) => console.error('Error loading appointments', error)
    );
  }

  loadPatientsAppointments() {
    this.appointmentService.getAppointmentsForPatient(this.senderId).subscribe(
      (data) => {
        this.appointments = data.filter((app) => app.status === 'ACCEPTED');
        this.allUsers = this.allUsers.filter((user) =>
          this.appointments.some((app) => app.doctor.email === user.email)
        );
      },
      (error) => console.error('Error loading appointments', error)
    );
  }

  selectReceiver(user: UserDetails): void {
    this.receiver = user.name;
    this.receiverId = user.id;
    this.chatMessages = [];
    this.loadChatHistory();

    // Subscribe to WebSocket chat messages and deletion events
    this.webSocketService.subscribeToChat(this.senderId, this.receiverId);
    this.webSocketService.subscribeToChat(this.receiverId, this.senderId);
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const messageToSend = {
        senderName: this.sender,
        senderId: this.senderId,
        receiverName: this.receiver,
        receiverId: this.receiverId,
        content: this.newMessage,
      };
      this.webSocketService.sendMessage(messageToSend);
      this.newMessage = '';
    }
  }

  loadChatHistory() {
    if (this.receiverId) {
      this.httpClient
        .post<ChatMessage[]>(
          `http://localhost:8080/chat/history`,
          `${this.senderId}:${this.receiverId}`
        )
        .subscribe(
          (data) => {
            this.chatMessages = data;
            console.log('Loaded chat history', this.chatMessages);
          },
          (error) => console.error('Failed to load chat history', error)
        );
    }
  }

  deleteMessage(messageId: number) {
    this.httpClient
      .delete(`http://localhost:8080/chat/message/${messageId}`, {
        responseType: 'text' as 'json',
      })
      .subscribe(
        () => {
          this.webSocketService.sendDeleteNotification(
            messageId,
            this.senderId,
            this.receiverId
          );
        },
        (error) => console.error('Failed to delete message', error)
      );
  }
  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  toggleOptions(messageId: number): void {
    // Toggle the visibility state of the delete button for this message
    this.messageOptions[messageId] = !this.messageOptions[messageId];
  }
}
