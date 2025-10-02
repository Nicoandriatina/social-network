'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ 
  children, 
  userId 
}: { 
  children: React.ReactNode;
  userId: string;
}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      path: '/api/socket/io',
      addTrailingSlash: false
    });

    socketInstance.on('connect', () => {
      console.log('✅ Connecté au serveur Socket.IO');
      setIsConnected(true);
      // Rejoindre la room de l'utilisateur
      socketInstance.emit('join', userId);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Déconnecté du serveur Socket.IO');
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}