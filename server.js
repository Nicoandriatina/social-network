// const { createServer } = require('http');
// const { parse } = require('url');
// const next = require('next');
// const { Server } = require('socket.io');
// const { PrismaClient } = require('@prisma/client');

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

//     // ==========================================
//     // GESTION DES MESSAGES (EXISTANT)
//     // ==========================================
//     socket.on('send-message', async (data) => {
//       try {
//         const message = await prisma.message.create({
//           data: {
//             fromId: data.fromId,
//             toId: data.toId,
//             content: data.content,
//             read: false
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

//         // Créer la notification
//         const notification = await prisma.notification.create({
//           data: {
//             userId: data.toId,
//             type: 'MESSAGE',
//             title: 'Nouveau message',
//             content: `${message.from.fullName} vous a envoyé un message`,
//             messageId: message.id,
//             relatedUserId: data.fromId,
//             read: false
//           },
//           include: {
//             relatedUser: {
//               select: {
//                 id: true,
//                 fullName: true,
//                 avatar: true
//               }
//             }
//           }
//         });

//         // Émettre le message
//         io.to(data.fromId).emit('new-message', message);
//         io.to(data.toId).emit('new-message', message);
        
//         // Émettre la notification
//         io.to(data.toId).emit('new-notification', notification);

//         console.log('📨 Message et notification envoyés:', message.id);
//       } catch (error) {
//         console.error('❌ Erreur envoi message:', error);
//         socket.emit('message-error', { error: 'Erreur lors de l\'envoi' });
//       }
//     });

//     // ==========================================
//     // 🔥 NOUVEAU : ÉMETTRE UNE NOTIFICATION
//     // ==========================================
//     socket.on('emit-notification', async (notificationId) => {
//       try {
//         // Récupérer la notification complète depuis la BDD
//         const notification = await prisma.notification.findUnique({
//           where: { id: notificationId },
//           include: {
//             relatedUser: {
//               select: {
//                 id: true,
//                 fullName: true,
//                 avatar: true
//               }
//             },
//             project: {
//               select: {
//                 id: true,
//                 titre: true,
//                 reference: true
//               }
//             },
//             don: {
//               select: {
//                 id: true,
//                 libelle: true,
//                 type: true
//               }
//             }
//           }
//         });

//         if (notification) {
//           // Émettre à l'utilisateur concerné
//           io.to(notification.userId).emit('new-notification', notification);
//           console.log(`🔔 Notification émise pour user ${notification.userId}`);
//         }
//       } catch (error) {
//         console.error('❌ Erreur émission notification:', error);
//       }
//     });

//     // ==========================================
//     // TYPING INDICATOR (EXISTANT)
//     // ==========================================
//     socket.on('typing', (data) => {
//       io.to(data.toId).emit('user-typing', {
//         userId: data.userId,
//         isTyping: data.isTyping
//       });
//     });


//     // DÉCONNEXION (EXISTANT)
//     // ==========================================
//     socket.on('disconnect', () => {
//       console.log('❌ Client déconnecté:', socket.id);
//     });
//   });

//   // Exposer l'instance Socket.IO globalement pour l'utiliser dans les APIs
//   global.io = io;

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

    // ==========================================
    // 📨 GESTION DES MESSAGES (TEXTE + FICHIERS + IMAGES)
    // ==========================================
    socket.on('send-message', async (data) => {
      try {
        console.log('📤 Message reçu:', {
          type: data.type || 'TEXT',
          hasFile: !!data.fileUrl,
          fileName: data.fileName
        });

        // Vérifier que les utilisateurs sont amis
        const friendship = await prisma.friendRequest.findFirst({
          where: {
            OR: [
              { fromId: data.fromId, toId: data.toId, accepted: true },
              { fromId: data.toId, toId: data.fromId, accepted: true }
            ]
          }
        });

        if (!friendship) {
          socket.emit('message-error', { error: 'Vous ne pouvez envoyer des messages qu\'à vos amis' });
          return;
        }

        // Créer le message (texte, image ou fichier)
        const message = await prisma.message.create({
          data: {
            fromId: data.fromId,
            toId: data.toId,
            content: data.content,
            type: data.type || 'TEXT',
            fileUrl: data.fileUrl || null,
            fileName: data.fileName || null,
            fileSize: data.fileSize || null,
            mimeType: data.mimeType || null,
            publicId: data.publicId || null,
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

        console.log('✅ Message créé:', message.id, '- Type:', message.type);

        // Déterminer le contenu de la notification selon le type
        let notificationContent = data.content;
        if (data.type === 'IMAGE') {
          notificationContent = '📷 Image';
        } else if (data.type === 'FILE') {
          notificationContent = `📎 ${data.fileName}`;
        }

        // Créer la notification
        const notification = await prisma.notification.create({
          data: {
            userId: data.toId,
            type: 'MESSAGE',
            title: `Nouveau message de ${message.from.fullName}`,
            content: notificationContent,
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

        console.log('🔔 Notification créée:', notification.id);

        // Émettre le message aux deux utilisateurs (temps réel)
        io.to(data.fromId).emit('new-message', message);
        io.to(data.toId).emit('new-message', message);
        
        // Émettre la notification au destinataire
        io.to(data.toId).emit('new-notification', notification);

        console.log('📨 Message et notification envoyés en temps réel');
      } catch (error) {
        console.error('❌ Erreur envoi message:', error);
        socket.emit('message-error', { error: 'Erreur lors de l\'envoi' });
      }
    });

    // ==========================================
    // 🔔 ÉMETTRE UNE NOTIFICATION
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
    // ⌨️ TYPING INDICATOR
    // ==========================================
    socket.on('typing', (data) => {
      io.to(data.toId).emit('user-typing', {
        userId: data.userId,
        isTyping: data.isTyping
      });
    });

    // ==========================================
    // 👥 DEMANDE D'AMI (OPTIONNEL - si vous l'utilisez)
    // ==========================================
    socket.on('friend-request-sent', async ({ fromId, toId }) => {
      try {
        const sender = await prisma.user.findUnique({
          where: { id: fromId },
          select: { fullName: true, avatar: true }
        });

        const friendRequest = await prisma.friendRequest.findFirst({
          where: { fromId, toId }
        });

        if (sender && friendRequest) {
          const notification = await prisma.notification.create({
            data: {
              userId: toId,
              type: 'FRIEND_REQUEST',
              title: `Nouvelle demande d'ami`,
              content: `${sender.fullName} vous a envoyé une demande d'ami`,
              relatedUserId: fromId,
              friendRequestId: friendRequest.id
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

          io.to(toId).emit('new-notification', notification);
          io.to(toId).emit('friend-request-received', { friendRequest, sender });
        }
      } catch (error) {
        console.error('❌ Erreur demande ami:', error);
      }
    });

    // ==========================================
    // ✅ ACCEPTATION D'AMI (OPTIONNEL)
    // ==========================================
    socket.on('friend-request-accepted', async ({ fromId, toId }) => {
      try {
        const accepter = await prisma.user.findUnique({
          where: { id: toId },
          select: { fullName: true, avatar: true }
        });

        const friendRequest = await prisma.friendRequest.findFirst({
          where: { fromId, toId }
        });

        if (accepter && friendRequest) {
          const notification = await prisma.notification.create({
            data: {
              userId: fromId,
              type: 'FRIEND_ACCEPT',
              title: `Demande d'ami acceptée`,
              content: `${accepter.fullName} a accepté votre demande d'ami`,
              relatedUserId: toId,
              friendRequestId: friendRequest.id
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

          io.to(fromId).emit('new-notification', notification);
        }
      } catch (error) {
        console.error('❌ Erreur acceptation ami:', error);
      }
    });

    // ==========================================
    // 💬 COMMENTAIRE SUR PROJET (OPTIONNEL)
    // ==========================================
    socket.on('project-comment', async ({ projectId, userId, commentId }) => {
      try {
        const comment = await prisma.projectComment.findUnique({
          where: { id: commentId },
          include: {
            user: {
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
                reference: true,
                auteurId: true
              }
            }
          }
        });

        if (comment && comment.project.auteurId !== userId) {
          const notification = await prisma.notification.create({
            data: {
              userId: comment.project.auteurId,
              type: 'PROJECT_COMMENT',
              title: 'Nouveau commentaire',
              content: `${comment.user.fullName} a commenté votre projet "${comment.project.titre}"`,
              relatedUserId: userId,
              projectId: projectId
            },
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
              }
            }
          });

          io.to(comment.project.auteurId).emit('new-notification', notification);
        }
      } catch (error) {
        console.error('❌ Erreur commentaire projet:', error);
      }
    });

    // ==========================================
    // 🎁 DON REÇU (OPTIONNEL)
    // ==========================================
    socket.on('donation-received', async ({ donId, donateurId, beneficiaireId }) => {
      try {
        const don = await prisma.don.findUnique({
          where: { id: donId },
          include: {
            donateur: {
              select: {
                id: true,
                fullName: true,
                avatar: true
              }
            }
          }
        });

        if (don) {
          const notification = await prisma.notification.create({
            data: {
              userId: beneficiaireId,
              type: 'DONATION_RECEIVED',
              title: 'Nouveau don reçu',
              content: `${don.donateur.fullName} a fait un don : ${don.libelle}`,
              relatedUserId: donateurId,
              donId: donId
            },
            include: {
              relatedUser: {
                select: {
                  id: true,
                  fullName: true,
                  avatar: true
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

          io.to(beneficiaireId).emit('new-notification', notification);
        }
      } catch (error) {
        console.error('❌ Erreur don reçu:', error);
      }
    });

    // ==========================================
    // 🚪 DÉCONNEXION
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
      console.log(`✅ Support: Messages texte, images, fichiers en temps réel`);
    });
});