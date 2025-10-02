// const { createServer } = require('http');
// const { parse } = require('url');
// const next = require('next');
// const { Server } = require('socket.io');
// const { PrismaClient } = require('@prisma/client');
// const { read } = require('fs');

// const dev = process.env.NODE_ENV !== 'production';
// const hostname = 'localhost';
// const port = process.env.PORT || 3000;

// const app = next({ dev, hostname, port });
// const handle = app.getRequestHandler();

// const prisma = new PrismaClient();

// app.prepare().then(() => {
//   const httpServer = createServer(async (req, res) => {
//     try {
//       const parsedUrl = parse(req.url, true);
//       await handle(req, res, parsedUrl);
//     } catch (err) {
//       console.error('Error occurred handling', req.url, err);
//       res.statusCode = 500;
//       res.end('internal server error');
//     }
//   });

//   const io = new Server(httpServer, {
//     path: '/api/socket/io',
//     addTrailingSlash: false,
//     cors: {
//       origin: process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${port}`,
//       methods: ['GET', 'POST'],
//       credentials: true
//     }
//   });

//   io.on('connection', (socket) => {
//     console.log('✅ Client connecté:', socket.id);

//     socket.on('join', (userId) => {
//       socket.join(userId);
//       console.log(`👤 User ${userId} a rejoint sa room`);
//     });

//     socket.on('send-message', async (data) => {
//       try {
//         //cree le message
//         const message = await prisma.message.create({
//           data: {
//             fromId: data.fromId,
//             toId: data.toId,
//             content: data.content,
//             read:false
//           },
//           include: {
//             from: {
//               select: {
//                 id: true,
//                 fullName: true,
//                 avatar: true,
//                 type: true
//               }
//             },
//             to: {
//               select: {
//                 id: true,
//                 fullName: true,
//                 avatar: true,
//                 type: true
//               }
//             }
//           }
//         });
//          // Créer la notification
//         const notification = await prisma.notification.create({
//         data: {
//             userId: data.toId,
//             type: 'message',
//             title: 'Nouveau message',
//             content: `${message.from.fullName} vous a envoyé un message`,
//             messageId: message.id,
//             relatedUserId: data.fromId,
//             read: false
//         }
//         });

//         //emetre le msg
//         io.to(data.fromId).emit('new-message', message);
//         io.to(data.toId).emit('new-message', message);

//         //emetre notif
//         io.to(data.toId).emit('new-notification', {
//             ...notification,
//             relatedUser: message.from
//         });

//         console.log('📨 Message et notification envoyé:', message.id);
//       } catch (error) {
//         console.error('❌ Erreur envoi message:', error);
//         socket.emit('message-error', { error: 'Erreur lors de l\'envoi' });
//       }
//     });

//     socket.on('typing', (data) => {
//       io.to(data.toId).emit('user-typing', {
//         userId: data.userId,
//         isTyping: data.isTyping
//       });
//     });

//     socket.on('disconnect', () => {
//       console.log('❌ Client déconnecté:', socket.id);
//     });
//   });

//   httpServer
//     .once('error', (err) => {
//       console.error(err);
//       process.exit(1);
//     })
//     .listen(port, () => {
//       console.log(`🚀 Serveur prêt sur http://${hostname}:${port}`);
//       console.log(`📡 Socket.IO initialisé sur /api/socket/io`);
//     });
// });
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

        // Créer la notification avec type en MAJUSCULES
        const notification = await prisma.notification.create({
          data: {
            userId: data.toId,
            type: 'MESSAGE',  // ✅ Correspond à NotificationType.MESSAGE
            title: 'Nouveau message',
            content: `${message.from.fullName} vous a envoyé un message`,
            messageId: message.id,
            relatedUserId: data.fromId,
            read: false
          }
        });

        io.to(data.fromId).emit('new-message', message);
        io.to(data.toId).emit('new-message', message);
        
        io.to(data.toId).emit('new-notification', {
          ...notification,
          relatedUser: message.from
        });

        console.log('📨 Message et notification envoyés:', message.id);
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