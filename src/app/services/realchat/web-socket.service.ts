import { Injectable } from '@angular/core';
import { Client, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChatMessage } from 'src/app/models/chatMessages.model';



@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: any;
  private messageSource = new BehaviorSubject<ChatMessage | null>(null);  // Updated to emit ChatMessage objects
  currentMessage = this.messageSource.asObservable();
  private currentSubscription: any;
  private deleteMessageSource = new BehaviorSubject<number | null>(null);
  deletedMessage = this.deleteMessageSource.asObservable();
  videoCallRequest = new BehaviorSubject<any | null>(null);
  constructor(private httpClient: HttpClient) {}

  connect() {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      console.log('Connected to WebSocket');
    });
  }

  sendMessage(message: { senderName: string, senderId: number, receiverName: string, receiverId: number, content: string }) {
    console.log('Sending message aaaaaaaaaa:', message);
    const destination = `/app/chat/${message.senderId}/${message.receiverId}`;
    const messageString = JSON.stringify(message);  // Convert the message object to a string
    console.log('Sending message:', messageString);
    this.stompClient.send(destination, {}, messageString);  // Send the message to the backend
  }
  

  fetchChatHistory(senderId: number, receiverId: number) {
    const chatRequest = `${senderId}:${receiverId}`;
    return this.httpClient.post<ChatMessage[]>(`http://localhost:8080/chat/history`, chatRequest);
  }

  // subscribeToChat(senderId: number, receiverId: number) {
  //   const topic = `/topic/chat/${senderId}-${receiverId}`;
  //   this.currentSubscription = this.stompClient.subscribe(topic, (message: any) => {
  //     if (message.body) {
  //       const parsedMessage = this.parseMessage(message.body);
  //       this.messageSource.next(parsedMessage);  // Emit the parsed message
  //     }
  //   });
  //   console.log(`Subscribed to chat between ${senderId} and ${receiverId}`);
  // }

  // subscribeToChat(senderId: number, receiverId: number) {
  //   const topic = `/topic/chat/${senderId}-${receiverId}`;
  //   this.currentSubscription = this.stompClient.subscribe(topic, (message: any) => {
  //     if (message.body) {
  //       const parsedMessage = JSON.parse(message.body);
  
  //       if (parsedMessage.type === 'delete') {
  //         this.deleteMessageSource.next(parsedMessage.id);
  //       } else {
  //         this.messageSource.next(parsedMessage);
  //       }
  //     }
  //   });
  // }

  subscribeToChat(senderId: number, receiverId: number) {
    const topic = `/topic/chat/${senderId}-${receiverId}`;
    this.currentSubscription = this.stompClient.subscribe(topic, (message: any) => {
      if (message.body) {
        const parsedMessage = JSON.parse(message.body);
  
        if (parsedMessage.type === 'delete') {
          this.deleteMessageSource.next(parsedMessage.id);
        } else {
          console.log('Received message:', parsedMessage);
  
          // Check if senderId matches the stored senderId
          if (parsedMessage.senderId === senderId) {
            this.messageSource.next(parsedMessage);
          } else {
            console.error('Message received with mismatched senderId:', parsedMessage);
          }
        }
      }
    });
  }
  
  

  unsubscribeFromChat() {
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
      this.currentSubscription = null;
    }
  }

  // Helper method to parse the message into a ChatMessage object
  private parseMessage(messageBody: string): ChatMessage {
    try {
      // Parse the messageBody as JSON to get the full structure
      const parsedMessage = JSON.parse(messageBody);
  
      return {
        id: parseInt(parsedMessage.id, 10),  
        senderId: parseInt(parsedMessage.senderId, 10),  // Assuming senderId is a number
        receiverId: parseInt(parsedMessage.receiverId, 10),  // Assuming receiverId is a number
        senderName: parsedMessage.senderName,  // sender's name
        receiver: parsedMessage.receiverName,  // receiver's name
        message: parsedMessage.message,  // message content
        timestamp: new Date().toISOString(),  // Add timestamp
        sender: parsedMessage.senderName  // Add sender property
      };
    } catch (error) {
      console.error("Error parsing message:", error);
      return {
        id: 0,
        senderId: NaN,
        receiverId: NaN,
        senderName: "Unknown",
        receiver: "Unknown",
        message: "Error parsing message",
        timestamp: new Date().toISOString(),
        sender: "Unknown",

      };
    }
  }

  deleteMessage(messageId: number, senderId: number, receiverId: number) {
    const destination = `/app/delete/${senderId}/${receiverId}/${messageId}`;
    this.stompClient.send(destination, {});
  }
  
  sendDeleteNotification(messageId: number, senderId: number, receiverId: number) {
    const destination = `/app/chat/delete/${senderId}/${receiverId}/${messageId}`;
    this.stompClient.send(destination, {});
  }
  // sendVideoCallOffer(offer: RTCSessionDescriptionInit, receiverId: number) {
  //   const destination = `/app/video-call/offer/${receiverId}`;
  //   this.stompClient.send(destination, {}, JSON.stringify({ offer }));
  // }
  

  // sendVideoCallAnswer(answer: RTCSessionDescriptionInit) {
  //   const destination = '/app/videoCall/answer';
  //   this.stompClient.send(destination, {}, JSON.stringify(answer));
  // }

  // sendIceCandidate(candidate: RTCIceCandidate) {
  //   const destination = '/app/videoCall/iceCandidate';
  //   this.stompClient.send(destination, {}, JSON.stringify(candidate));
  // }
}
