import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectorRef } from '@angular/core';
import { UserStorageService } from '../services/storage/user-storage.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  userMessage: string = ''; // Holds user input
  messages: { sender: string; text: string; time: string }[] = []; // Chat history
  currentUser: string = '';
  currentName: string = '';
  awaitingConfirmation: boolean = false;
  lastUnansweredQuestion: string = ''; // Store last question without an answer
  suggestedQuestions: { question: string; answer: string }[] = [];
  editingIndex: number | null = null; // Track which message is being edited
  isRecording: boolean = false;
  recognition: any;
  userInput: string = '';
  constructor(
    private http: HttpClient,
    private userStorage: UserStorageService,
    private cdRef: ChangeDetectorRef
  ) {
    const user = UserStorageService.getUser();
    this.currentUser = user.email;
    this.currentName = user.name || 'Guest';
    console.log('Current user email:', this.currentUser);

    // Predefined suggested questions
    this.suggestedQuestions = [
      {
        question: 'What is a medical chatbot?',
        answer:
          'A medical chatbot helps patients with healthcare questions and schedules appointments.',
      },
      {
        question: 'How do I book an appointment?',
        answer:
          'You can book an appointment by selecting a doctor and choosing a time slot.',
      },
      {
        question: 'What is an ultrasound scan?',
        answer:
          'An ultrasound scan uses sound waves to create images of organs inside the body.',
      },
    ];
  }

  ngOnInit(): void {
    // Check if browser supports speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        this.userMessage = event.results[0][0].transcript; // ✅ Update userMessage instead of userInput
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

  sendMessage() {
    if (!this.userMessage.trim()) return; // Don't send empty messages

    const time = new Date().toLocaleTimeString();
    const originalMessage = this.userMessage.toLowerCase(); // Convert to lowercase

    if (this.awaitingConfirmation) {
      this.handleUserResponse();
      this.userMessage = ''; // Clear input after handling response
      return;
    }

    if (this.editingIndex !== null) {
      // ✅ If editing, update the message and remove all following messages
      this.messages[this.editingIndex].text = originalMessage;

      // Remove all subsequent messages (user's second message, bot's response, etc.)
      const messagesToRemoveCount =
        this.messages.length - this.editingIndex - 1;
      if (messagesToRemoveCount > 0) {
        this.messages.splice(this.editingIndex + 1, messagesToRemoveCount);
      }

      // Call bot again for new response
      this.getBotResponse(originalMessage, this.editingIndex);

      this.editingIndex = null;
    } else {
      // Otherwise, send a new message
      this.messages.push({ sender: 'user', text: originalMessage, time });
      this.getBotResponse(originalMessage, this.messages.length - 1);
    }

    this.userMessage = ''; // Clear input field
  }

  getBotResponse(userInput: string, replaceIndex: number | null = null) {
    const time = new Date().toLocaleTimeString();

    this.http
      .post<{ response: string }>('http://localhost:5000/get', {
        msg: userInput,
        name: this.currentName,
      })
      .subscribe(
        (response) => {
          console.log('Bot response:', response); // Log the raw response

          const botReply = response.response.toLowerCase();

          // Check if bot response offers agent contact
          if (
            !response.response ||
            botReply.includes("i don't know") ||
            botReply.includes('not sure') ||
            botReply.includes('i do not have any information') ||
           botReply.includes('i suggest contacting a human agent for further assistance') ||
            botReply.includes('my knowledge is limited to') ||
            botReply.includes('as mentioned before') ||
            botReply.includes('as an ai') ||
            botReply.includes(
              'would you like me to connect you with an agent who may be able to assist you'
            ) ||
            botReply.includes('i am sorry, i do not have information') ||
            botReply.includes('i am sorry, but i am not knowledgeable about')||

           botReply.includes('i apologize, but as a medical assistant')||
           botReply.includes('i am not able to provide information about ')||
           botReply.includes('please contact a human agent for further assistance')
           
          ) {
            const botMessage = {
              sender: 'bot',
              text: " As an AI designed for medical assistance, I am not knowledgeable about this Topic. Do you want to contact an agent? (Type 'yes' to proceed, 'no' to continue chatting)",
              time,
            };

            if (replaceIndex !== null) {
              this.messages.splice(replaceIndex + 1, 0, botMessage);
            } else {
              this.messages.push(botMessage);
            }

            this.awaitingConfirmation = true;
            this.lastUnansweredQuestion = userInput; // Store the last unanswered question
          } else {
            const botMessage = { sender: 'bot', text: response.response, time };
            if (replaceIndex !== null) {
              this.messages.splice(replaceIndex + 1, 0, botMessage);
            } else {
              this.messages.push(botMessage);
            }
          }
        },
        (error) => {
          console.error('Error:', error);
          this.messages.push({
            sender: 'bot',
            text: 'Error communicating with the server.',
            time,
          });
        }
      );
  }

  handleUserResponse() {
    const time = new Date().toLocaleTimeString();
    const userResponse = this.userMessage.toLowerCase(); // Store response before clearing

    // ✅ Manually add "yes" or "no" to the chat
    this.messages.push({ sender: 'user', text: userResponse, time });

    if (userResponse === 'yes') {
      const user = UserStorageService.getUser();
      const conversation = this.messages
        .map((msg) => `${msg.sender}: ${msg.text}`)
        .join('\n');

      this.http
        .post('http://localhost:8080/reclamations/save', {
          description: `Unanswered question: ${this.lastUnansweredQuestion}\n\nFull Conversation:\n${conversation}`,
          ownerId: user ? user.userId : null,
          email: this.currentUser,
        })
        .subscribe(
          () => {
            this.messages.push({
              sender: 'bot',
              text: 'Your request has been saved. An agent will contact you soon.',
              time,
            });
          },
          (error) => {
            console.error('Error saving reclamation:', error);
            this.messages.push({
              sender: 'bot',
              text: 'Failed to save your request. Please try again later.',
              time,
            });
          }
        );
    } else if (userResponse === 'no') {
      this.messages.push({
        sender: 'bot',
        text: 'Alright! Feel free to ask me anything else.',
        time,
      });
    }

    // ✅ Reset confirmation state
    this.awaitingConfirmation = false;
    this.lastUnansweredQuestion = '';

    this.userMessage = ''; // ✅ Clear input after handling response
  }

  selectSuggestedQuestion(question: string, answer: string) {
    const time = new Date().toLocaleTimeString();
    this.messages.push({ sender: 'user', text: question, time });

    setTimeout(() => {
      this.messages.push({ sender: 'bot', text: answer, time });
    }, 500);
  }

  editMessage(index: number) {
    this.userMessage = this.messages[index].text;
    this.editingIndex = index;
  }
}
