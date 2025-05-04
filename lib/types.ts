export enum MessageRole {
  User = 'user',
  Assistant = 'assistant',
  System = 'system'
}

export enum AgentStatus {
  Idle = 'idle',
  Thinking = 'thinking',
  Executing = 'executing',
  Done = 'done',
  Error = 'error'
}

export interface AgentAction {
  title: string;
  description?: string;
  status: AgentStatus;
}

export interface Screenshot {
  url: string;
  base64?: string;
  step: number;
  description?: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  agentActions?: AgentAction[];
  screenshots?: Screenshot[];
  result?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskRequest {
  task: string;
  context?: Record<string, any>;
}

export interface TaskResponse {
  result: string;
  status: string;
  screenshot_urls: string[];
}

export interface WebSocketMessage {
  screenshot_url?: string;
  screenshot_base64?: string;
  step?: number;
  result?: string;
  status?: string;
  error?: string;
  done?: boolean;
  screenshot_urls?: string[];
}