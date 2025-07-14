import { Injectable } from '@angular/core';
import { Client, Message, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketServiceService {
  private stompClient!: Client;
  private notificationSubject = new Subject<any>();

  constructor() {
    this.connect();
  }

  private connect() {
    const socket = new SockJS(`${environment.apiBaseUrl}/ws`);
    this.stompClient = Stomp.over(socket);
  
    this.stompClient.onConnect = () => {
      console.log("Connected to WebSocket");
      this.onConnected();
    };
  
    this.stompClient.onStompError = (frame) => {
      console.error('WebSocket error:', frame);
    };
  
    this.stompClient.activate();
  }
  
  private onConnected() {
    console.log("Successfully connected to the WebSocket server.");
  }
  
  subscribeToNotifications(patientId: number) {
    if (!this.stompClient || !this.stompClient.connected) {
      console.log("WebSocket not connected yet.");
      return;
    }
    const topic = `/topic/patient-${patientId}`;
    this.stompClient.subscribe(topic, (message: Message) => {
      console.log("Message received:", message.body);
      this.notificationSubject.next(JSON.parse(message.body));
    });
    
  }
  

  getNotifications() {
    return this.notificationSubject.asObservable();
  }
}
