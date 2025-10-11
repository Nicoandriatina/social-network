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

    // ==========================================
    // GESTION DES MESSAGES (EXISTANT)
    // ==========================================
    socket.on('send-message', async (data) => {
      try {
        const message = await prisma.message.create({
          data: {
            fromId: data.fromId,
            toId: data.toId,
            content: data.content,
            read: false
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

        // Créer la notification
        const notification = await prisma.notification.create({
          data: {
            userId: data.toId,
            type: 'MESSAGE',
            title: 'Nouveau message',
            content: `${message.from.fullName} vous a envoyé un message`,
            messageId: message.id,
            relatedUserId: data.fromId,
            read: false
          },
          include: {
            relatedUser: {
              select: {
                id: true,
                fullName: true,
                avatar: true
              }
            }
          }
        });

        // Émettre le message
        io.to(data.fromId).emit('new-message', message);
        io.to(data.toId).emit('new-message', message);
        
        // Émettre la notification
        io.to(data.toId).emit('new-notification', notification);

        console.log('📨 Message et notification envoyés:', message.id);
      } catch (error) {
        console.error('❌ Erreur envoi message:', error);
        socket.emit('message-error', { error: 'Erreur lors de l\'envoi' });
      }
    });

    // ==========================================
    // 🔥 NOUVEAU : ÉMETTRE UNE NOTIFICATION
    // ==========================================
    socket.on('emit-notification', async (notificationId) => {
      try {
        // Récupérer la notification complète depuis la BDD
        const notification = await prisma.notification.findUnique({
          where: { id: notificationId },
          include: {
            relatedUser: {
              select: {
                id: true,
                fullName: true,
                avatar: true
              }
            },
            project: {
              select: {
                id: true,
                titre: true,
                reference: true
              }
            },
            don: {
              select: {
                id: true,
                libelle: true,
                type: true
              }
            }
          }
        });

        if (notification) {
          // Émettre à l'utilisateur concerné
          io.to(notification.userId).emit('new-notification', notification);
          console.log(`🔔 Notification émise pour user ${notification.userId}`);
        }
      } catch (error) {
        console.error('❌ Erreur émission notification:', error);
      }
    });

    // ==========================================
    // TYPING INDICATOR (EXISTANT)
    // ==========================================
    socket.on('typing', (data) => {
      io.to(data.toId).emit('user-typing', {
        userId: data.userId,
        isTyping: data.isTyping
      });
    });


    // DÉCONNEXION (EXISTANT)
    // ==========================================
    socket.on('disconnect', () => {
      console.log('❌ Client déconnecté:', socket.id);
    });
  });

  // Exposer l'instance Socket.IO globalement pour l'utiliser dans les APIs
  global.io = io;

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