import { TaskRequest, WebSocketMessage } from './types';

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private onMessageCallback: (data: WebSocketMessage) => void;
  private onOpenCallback: () => void;
  private onCloseCallback: () => void;
  private onErrorCallback: (error: Event) => void;

  constructor(
    url: string,
    onMessage: (data: WebSocketMessage) => void,
    onOpen: () => void = () => {},
    onClose: () => void = () => {},
    onError: (error: Event) => void = () => {}
  ) {
    this.url = url;
    this.onMessageCallback = onMessage;
    this.onOpenCallback = onOpen;
    this.onCloseCallback = onClose;
    this.onErrorCallback = onError;
  }

  connect(): void {
    if (this.ws) {
      this.ws.close();
    }

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.onOpenCallback();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WebSocketMessage;
        this.onMessageCallback(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      this.onCloseCallback();
      this.ws = null;
    };

    this.ws.onerror = (error) => {
      this.onErrorCallback(error);
    };
  }

  sendMessage(task: TaskRequest): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(task));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

// Singleton instance for app-wide access
let wsClient: WebSocketClient | null = null;

export const getWebSocketClient = (
  url: string = 'ws://localhost:8000/ws/agent',
  onMessage: (data: WebSocketMessage) => void,
  onOpen: () => void = () => {},
  onClose: () => void = () => {},
  onError: (error: Event) => void = () => {}
): WebSocketClient => {
  if (!wsClient) {
    wsClient = new WebSocketClient(url, onMessage, onOpen, onClose, onError);
  }
  return wsClient;
};