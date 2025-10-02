import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { prisma } from './prisma';

export type NextApiResponseServerIO = {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

let io: SocketIOServer | undefined;

export const initSocketIO = (httpServer: NetServer) => {
  if (io) {
    return io;
  }

  io = new SocketIOServer(httpServer, {
    path: '/api/socket/io',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('✅ Client connecté:', socket.id);

    // Rejoindre une room par userId
    socket.on('join', (userId: string) => {
      socket.join(userId);
      console.log(`👤 User ${userId} a rejoint sa room`);
    });

    // Envoyer un message
    socket.on('send-message', async (data: {
      fromId: string;
      toId: string;
      content: string;
    }) => {
      try {
        // Créer le message en base
        const message = await prisma.message.create({
          data: {
            fromId: data.fromId,
            toId: data.toId,
            content: data.content
          },
          include: {
            from: {
              select: {
                id: true,
                fullName: true,
                avatar: true,
                type: true
              }
            },
            to: {
              select: {
                id: true,
                fullName: true,
                avatar: true,
                type: true
              }
            }
          }
        });

        // Envoyer à l'expéditeur
        io?.to(data.fromId).emit('new-message', message);
        
        // Envoyer au destinataire
        io?.to(data.toId).emit('new-message', message);

        console.log('📨 Message envoyé:', message.id);
      } catch (error) {
        console.error('❌ Erreur envoi message:', error);
        socket.emit('message-error', { error: 'Erreur lors de l\'envoi' });
      }
    });

    // Typing indicator
    socket.on('typing', (data: { userId: string; toId: string; isTyping: boolean }) => {
      io?.to(data.toId).emit('user-typing', {
        userId: data.userId,
        isTyping: data.isTyping
      });
    });

    // Déconnexion
    socket.on('disconnect', () => {
      console.log('❌ Client déconnecté:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO non initialisé');
  }
  return io;
};