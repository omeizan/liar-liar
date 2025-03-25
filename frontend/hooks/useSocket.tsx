import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Generate a random user ID if one doesn't exist
const generateUserId = (): string => {
  return `user-${Math.random().toString(36).substring(2, 15)}`;
};

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL;

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  userId: string;
  isLoading: boolean; // New loading state
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true); // Set loading state to true initially

  useEffect(() => {
    // Function to save the user ID to AsyncStorage
    const saveUserId = async (userId: string) => {
      try {
        await AsyncStorage.setItem('userId', userId);
      } catch (error) {
        console.error('Error saving user ID to AsyncStorage:', error);
      }
    };

    // Function to load the user ID from AsyncStorage
    const loadUserId = async () => {
      try {
        const savedUserId = await AsyncStorage.getItem('userId');
        if (savedUserId) {
          setUserId(savedUserId);
        } else {
          const newUserId = generateUserId();
          setUserId(newUserId);
          saveUserId(newUserId);
        }
        setIsLoading(false); // Set loading to false once the userId is loaded
      } catch (error) {
        console.error('Error loading user ID from AsyncStorage:', error);
        setIsLoading(false); // Set loading to false even if there's an error
      }
    };

    loadUserId(); // Load user ID when the component mounts

    // Initialize socket connection
    const newSocket: Socket = io(SOCKET_URL, {
      autoConnect: false, // Prevent automatic reconnection issues
      transports: ["websocket"], // Ensure WebSocket connection
    });

    newSocket.on("connect", () => {
      //console.log("Connected to socket:", newSocket.id);
      setIsConnected(true);

      // Emit user ID to the server when the socket is connected
      if (userId) {
        newSocket.emit("setUserId", userId); // Send user ID to the server
        //console.log("User ID sent to server:", userId);
      }
    });

    newSocket.on("disconnect", () => {
      //console.log("Disconnected from socket");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.cause, error);
    });

    newSocket.connect(); // Manually connect the socket

    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // Cleanup on unmount
    };
  }, [userId]); // Re-run the effect if the userId changes

  return (
    <SocketContext.Provider value={{ socket, isConnected, userId, isLoading }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
