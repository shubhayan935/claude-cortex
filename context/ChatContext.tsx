"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Chat, 
  Message, 
  MessageRole, 
  AgentStatus, 
  Screenshot, 
  AgentAction, 
  WebSocketMessage 
} from '../lib/types';
import { getWebSocketClient } from '../lib/websocket';

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  agentStatus: AgentStatus;
  currentScreenshots: Screenshot[];
  currentAction: AgentAction | null;
  isConnected: boolean;
  sendMessage: (content: string) => void;
  createNewChat: () => void;
  selectChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>(AgentStatus.Idle);
  const [currentScreenshots, setCurrentScreenshots] = useState<Screenshot[]>([]);
  const [currentAction, setCurrentAction] = useState<AgentAction | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const handleWebSocketMessage = (data: WebSocketMessage) => {
    console.log('WebSocket message received:', data);
    if (data.screenshot_url && data.step !== undefined) {
      const newScreenshot: Screenshot = {
        url: data.screenshot_url,
        base64: data.screenshot_base64,
        step: data.step,
        description: data.status,
      };
      
      setCurrentScreenshots(prev => [...prev, newScreenshot]);
      
      // Update the current action to reflect progress
      setCurrentAction(prev => {
        if (prev) {
          return {
            ...prev,
            status: AgentStatus.Executing,
            // description: `Step ${data.step}: Processing`,
          };
        }
        return prev;
      });
    }

    if (data.error) {
      setAgentStatus(AgentStatus.Error);
      // Pass the current action and screenshots to preserve them
      addAgentMessage(`Error: ${data.error}`, 
        currentAction ? [currentAction] : [], 
        [...currentScreenshots]
      );
    }

    if (data.done && data.result) {
      setAgentStatus(AgentStatus.Done);
      // Save the current action and screenshots with the message
      // instead of clearing them immediately
      addAgentMessage(data.result, 
        currentAction ? [currentAction] : [], 
        [...currentScreenshots]
      );
      
      // Reset current states after saving them with the message
      // setTimeout(() => {
      //   setCurrentAction(null);
      //   setCurrentScreenshots([]);
      // }, 500);
    }
  };

  // Initialize with a default chat and WebSocket connection
  useEffect(() => {
    const storedChats = localStorage.getItem('cortex-chats');
    if (storedChats) {
      try {
        const parsedChats = JSON.parse(storedChats) as Chat[];
        setChats(parsedChats);
        if (parsedChats.length > 0) {
          setCurrentChat(parsedChats[0]);
        } else {
          createNewChat();
        }
      } catch (error) {
        console.error('Error parsing stored chats:', error);
        createNewChat();
      }
    } else {
      createNewChat();
    }

    // Initialize the WebSocket client
    const wsClient = getWebSocketClient(
      'ws://localhost:8000/ws/agent',
      handleWebSocketMessage,
      () => setIsConnected(true),
      () => {
        setIsConnected(false);
        setAgentStatus(AgentStatus.Idle);
      },
      (error) => {
        console.error('WebSocket error:', error);
        setAgentStatus(AgentStatus.Error);
      }
    );
    
    // Connect immediately
    wsClient.connect();
    
    // Reconnect logic for handling disconnections
    const reconnectInterval = setInterval(() => {
      if (!wsClient.isConnected()) {
        console.log('Attempting to reconnect WebSocket...');
        wsClient.connect();
      }
    }, 5000); // Check every 5 seconds
    
    // Cleanup function
    return () => {
      clearInterval(reconnectInterval);
      wsClient.disconnect();
    };
  }, []);

  // Save chats to localStorage when they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('cortex-chats', JSON.stringify(chats));
    }
  }, [chats]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setChats(prev => [newChat, ...prev]);
    setCurrentChat(newChat);
    setCurrentScreenshots([]);
    setCurrentAction(null);
    setAgentStatus(AgentStatus.Idle);
  };

  const selectChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
      setCurrentScreenshots([]);
      setCurrentAction(null);
      setAgentStatus(AgentStatus.Idle);
    }
  };

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (currentChat?.id === chatId) {
      const remainingChats = chats.filter(c => c.id !== chatId);
      if (remainingChats.length > 0) {
        setCurrentChat(remainingChats[0]);
      } else {
        createNewChat();
      }
    }
  };

  const addUserMessage = (content: string) => {
    if (!currentChat) return;
    
    const newMessage: Message = {
      id: uuidv4(),
      role: MessageRole.User,
      content,
      timestamp: new Date(),
    };
    
    const updatedChat: Chat = {
      ...currentChat,
      messages: [...currentChat.messages, newMessage],
      title: content.length > 30 ? `${content.substring(0, 30)}...` : content,
      updatedAt: new Date(),
    };
    
    setCurrentChat(updatedChat);
    setChats(prev => prev.map(c => c.id === updatedChat.id ? updatedChat : c));
  };

  const addAgentMessage = (content: string, agentActions: AgentAction[] = [], screenshots: Screenshot[] = []) => {
    if (!currentChat) return;
    
    const newMessage: Message = {
      id: uuidv4(),
      role: MessageRole.Assistant,
      content,
      timestamp: new Date(),
      agentActions: agentActions.length > 0 ? [...agentActions] : undefined,
      screenshots: screenshots.length > 0 ? [...screenshots] : undefined,
    };
    
    const updatedChat: Chat = {
      ...currentChat,
      messages: [...currentChat.messages, newMessage],
      updatedAt: new Date(),
    };
    
    setCurrentChat(updatedChat);
    setChats(prev => prev.map(c => c.id === updatedChat.id ? updatedChat : c));
  };

  const sendMessage = (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    addUserMessage(content);
    
    // Set up agent status
    setAgentStatus(AgentStatus.Thinking);
    setCurrentScreenshots([]);
    
    // Add initial "thinking" message from agent
    const thinkingAction: AgentAction = {
      title: 'Thinking and working...',
      status: AgentStatus.Thinking,
    };
    setCurrentAction(thinkingAction);
    
    // Get WebSocket client (already connected from useEffect)
    const wsClient = getWebSocketClient();
    
    // Send task to the agent
    wsClient.sendMessage({ task: content });
    
    // Update initial action to browser agent initializing
    setTimeout(() => {
      const initAction: AgentAction = {
        title: 'Browser Agent - Executing browser actions',
        description: 'Initializing browser agent...',
        status: AgentStatus.Executing,
      };
      setCurrentAction(initAction);
      setAgentStatus(AgentStatus.Executing);
    }, 1500);
  };

  const value = {
    chats,
    currentChat,
    agentStatus,
    currentScreenshots,
    currentAction,
    isConnected,
    sendMessage,
    createNewChat,
    selectChat,
    deleteChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};