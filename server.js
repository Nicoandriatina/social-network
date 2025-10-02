const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const prisma = new PrismaClient();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(httpServer, {
    path: '/api/socket/io',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${port}`,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('✅ Client connecté:', socket.id);

    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`👤 User ${userId} a rejoint sa room`);
    });

    socket.on('send-message', async (data) => {
      try {
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

        io.to(data.fromId).emit('new-message', message);
        io.to(data.toId).emit('new-message', message);

        console.log('📨 Message envoyé:', message.id);
      } catch (error) {
        console.error('❌ Erreur envoi message:', error);
        socket.emit('message-error', { error: 'Erreur lors de l\'envoi' });
      }
    });

    socket.on('typing', (data) => {
      io.to(data.toId).emit('user-typing', {
        userId: data.userId,
        isTyping: data.isTyping
      });
    });

    socket.on('disconnect', () => {
      console.log('❌ Client déconnecté:', socket.id);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`🚀 Serveur prêt sur http://${hostname}:${port}`);
      console.log(`📡 Socket.IO initialisé sur /api/socket/io`);
    });
});