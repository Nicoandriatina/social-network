// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { Send, Search, Plus, X, Paperclip, Image as ImageIcon, Smile, Phone, Video, Settings } from 'lucide-react';
// import { useSocket } from '@/app/contexts/SocketContext';
// import { AvatarDisplay, AvatarBadge } from '@/components/AvatarDisplay';

// interface User {
//   id: string;
//   fullName: string;
//   avatar: string | null;
//   type: string;
// }

// interface Message {
//   id: string;
//   content: string;
//   sentAt: string;
//   fromId: string;
//   from: User;
// }

// interface Conversation {
//   user: User;
//   lastMessage: Message;
//   unreadCount: number;
// }

// interface MessagesPageProps {
//   currentUserId: string;
//   currentUser?: {
//     fullName: string;
//     avatar?: string | null;  // ✅ Ajouter l'avatar
//     type: string;
//   };
// }

// export default function MessagesPage({ currentUserId, currentUser }: MessagesPageProps) {
//   const { socket, isConnected } = useSocket();
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [currentChat, setCurrentChat] = useState<Conversation | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const typingTimeoutRef = useRef<NodeJS.Timeout>();
  
//   const [showNewChatModal, setShowNewChatModal] = useState(false);
//   const [friends, setFriends] = useState<User[]>([]);
//   const [friendSearchTerm, setFriendSearchTerm] = useState('');
//   const [loadingFriends, setLoadingFriends] = useState(false);

//   // ✅ État pour stocker l'avatar de l'utilisateur connecté
//   const [myAvatar, setMyAvatar] = useState<string | null>(currentUser?.avatar || null);
//   useEffect(() => {
//     loadConversations();
    
//     // 🔍 Récupérer l'avatar de l'utilisateur connecté au cas où il n'est pas passé
//     const fetchMyAvatar = async () => {
//       try {
//         const response = await fetch('/api/user/me');
//         if (response.ok) {
//           const data = await response.json();
//           console.log('🔍 Avatar récupéré de /api/user/me:', data.user?.avatar);
//           if (data.user?.avatar) {
//             setMyAvatar(data.user.avatar);
//           }
//         }
//       } catch (error) {
//         console.error('❌ Erreur récupération avatar:', error);
//       }
//     };
    
//     if (!myAvatar) {
//       fetchMyAvatar();
//     }
//   }, [myAvatar]);

//   useEffect(() => {
//     if (currentChat) {
//       loadMessages(currentChat.user.id);
//     }
//   }, [currentChat]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   useEffect(() => {
//     if (!socket) return;

//     socket.on('new-message', (message: Message) => {
//       console.log('📨 Nouveau message reçu:', message);
      
//       if (currentChat && 
//           (message.fromId === currentChat.user.id || message.fromId === currentUserId)) {
//         // ✅ Éviter les doublons - ne pas ajouter si c'est notre propre message déjà affiché
//         setMessages(prev => {
//           // Vérifier si le message existe déjà
//           const exists = prev.some(m => 
//             m.content === message.content && 
//             m.fromId === message.fromId &&
//             Math.abs(new Date(m.sentAt).getTime() - new Date(message.sentAt).getTime()) < 1000
//           );
          
//           if (exists) return prev;
          
//           // Remplacer le message temporaire s'il existe
//           const withoutTemp = prev.filter(m => !m.id.startsWith('temp-'));
//           return [...withoutTemp, message];
//         });
//       }
      
//       loadConversations();
//     });

//     socket.on('user-typing', ({ userId, isTyping }) => {
//       if (currentChat && userId === currentChat.user.id) {
//         setIsTyping(isTyping);
//       }
//     });

//     return () => {
//       socket.off('new-message');
//       socket.off('user-typing');
//     };
//   }, [socket, currentChat, currentUserId]);

//   const loadConversations = async () => {
//     try {
//       const response = await fetch('/api/messages/conversations');
//       if (!response.ok) throw new Error('Erreur chargement');
//       const data = await response.json();
//       setConversations(data.conversations || []);
//     } catch (error) {
//       console.error('❌ Erreur:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadMessages = async (userId: string) => {
//     try {
//       const response = await fetch(`/api/messages/${userId}`);
//       if (!response.ok) throw new Error('Erreur chargement messages');
//       const data = await response.json();
//       setMessages(data.messages || []);
//     } catch (error) {
//       console.error('❌ Erreur:', error);
//     }
//   };

//   const loadFriends = async () => {
//     setLoadingFriends(true);
//     try {
//       const response = await fetch('/api/friends');
//       if (!response.ok) throw new Error('Erreur chargement amis');
//       const data = await response.json();
//       setFriends(data.friends || []);
//     } catch (error) {
//       console.error('❌ Erreur:', error);
//     } finally {
//       setLoadingFriends(false);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !currentChat || !socket) return;

//     const messageData = {
//       fromId: currentUserId,
//       toId: currentChat.user.id,
//       content: newMessage.trim()
//     };

//     // ✅ Ajouter immédiatement le message localement avec l'avatar
//     const tempMessage: Message = {
//       id: `temp-${Date.now()}`,
//       content: newMessage.trim(),
//       sentAt: new Date().toISOString(),
//       fromId: currentUserId,
//       from: {
//         id: currentUserId,
//         fullName: currentUser?.fullName || 'Vous',
//         avatar: myAvatar,  // ✅ Utiliser l'avatar stocké
//         type: currentUser?.type || ''
//       }
//     };

//     // Ajouter le message à l'affichage immédiatement
//     setMessages(prev => [...prev, tempMessage]);

//     socket.emit('send-message', messageData);
    
//     setNewMessage('');
    
//     if (textareaRef.current) {
//       textareaRef.current.style.height = 'auto';
//     }

//     socket.emit('typing', {
//       userId: currentUserId,
//       toId: currentChat.user.id,
//       isTyping: false
//     });
//   };

//   const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setNewMessage(e.target.value);
//     e.target.style.height = 'auto';
//     e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';

//     if (!socket || !currentChat) return;

//     socket.emit('typing', {
//       userId: currentUserId,
//       toId: currentChat.user.id,
//       isTyping: true
//     });

//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current);
//     }

//     typingTimeoutRef.current = setTimeout(() => {
//       socket.emit('typing', {
//         userId: currentUserId,
//         toId: currentChat.user.id,
//         isTyping: false
//       });
//     }, 2000);
//   };

//   const handleStartNewChat = (friend: User) => {
//     const existingConv = conversations.find(c => c.user.id === friend.id);
    
//     if (existingConv) {
//       setCurrentChat(existingConv);
//     } else {
//       setCurrentChat({
//         user: friend,
//         lastMessage: {
//           id: '',
//           content: '',
//           sentAt: new Date().toISOString(),
//           fromId: currentUserId,
//           from: friend
//         },
//         unreadCount: 0
//       });
//       setMessages([]);
//     }
    
//     setShowNewChatModal(false);
//     setFriendSearchTerm('');
//   };

//   const handleOpenNewChatModal = () => {
//     setShowNewChatModal(true);
//     loadFriends();
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const getInitials = (name: string) => {
//     return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
//   };

//   const formatTime = (date: string) => {
//     return new Intl.DateTimeFormat('fr-FR', {
//       hour: '2-digit',
//       minute: '2-digit'
//     }).format(new Date(date));
//   };

//   const getAvatarColor = (name: string) => {
//     const colors = [
//       'linear-gradient(135deg, #48bb78, #38a169)',
//       'linear-gradient(135deg, #ed8936, #dd6b20)',
//       'linear-gradient(135deg, #667eea, #764ba2)',
//       'linear-gradient(135deg, #e53e3e, #c53030)',
//       'linear-gradient(135deg, #9f7aea, #805ad5)'
//     ];
//     const index = name.charCodeAt(0) % colors.length;
//     return colors[index];
//   };

//   const filteredConversations = conversations.filter(conv =>
//     conv.user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredFriends = friends.filter(friend =>
//     friend.fullName.toLowerCase().includes(friendSearchTerm.toLowerCase()) &&
//     !conversations.some(c => c.user.id === friend.id)
//   );

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-50 to-slate-200">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="h-full bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex">
//         {/* ✅ Sidebar avec position relative pour le bouton */}
//         <aside className="w-[350px] bg-white border-r border-slate-200 flex flex-col relative">
//           <div className="p-6 border-b border-slate-200">
//             <h2 className="text-2xl font-bold text-slate-800 mb-4">Messages</h2>
//             <div className="relative">
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
//               <input
//                 type="text"
//                 className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors"
//                 placeholder="Rechercher une conversation..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* ✅ Liste des conversations avec padding-bottom pour ne pas cacher le bouton + */}
//           <div className="flex-1 overflow-y-auto custom-scrollbar pb-20">
//             {filteredConversations.length === 0 ? (
//               <div className="p-6 text-center text-slate-500">
//                 <div className="text-4xl mb-2">💬</div>
//                 <p className="text-sm">Aucune conversation</p>
//                 <p className="text-xs mt-2 text-slate-400">Cliquez sur + pour commencer</p>
//               </div>
//             ) : (
//               filteredConversations.map((conv) => (
//                 <div
//                   key={conv.user.id}
//                   className={`flex items-center gap-4 p-4 cursor-pointer transition-all border-b border-slate-50 ${
//                     currentChat?.user.id === conv.user.id 
//                       ? 'bg-gradient-to-r from-indigo-50/70 to-purple-50/70 border-r-[3px] border-r-indigo-500' 
//                       : 'hover:bg-slate-50'
//                   }`}
//                   onClick={() => setCurrentChat(conv)}
//                 >
//                   {/* ✅ Utiliser AvatarBadge au lieu du div avec initiales */}
//                   <AvatarBadge
//                     name={conv.user.fullName}
//                     avatar={conv.user.avatar}
//                     size="md"
//                   />
//                   <div className="flex-1 min-w-0">
//                     <div className="font-semibold text-slate-800 text-base mb-1">{conv.user.fullName}</div>
//                     <div className="text-sm text-slate-500 truncate">{conv.lastMessage.content}</div>
//                   </div>
//                   <div className="flex flex-col items-end gap-1">
//                     <div className="text-xs text-slate-400">{formatTime(conv.lastMessage.sentAt)}</div>
//                     {conv.unreadCount > 0 && (
//                       <div className="min-w-[20px] h-5 px-1.5 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
//                         {conv.unreadCount}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* ✅ Bouton + repositionné : plus haut (bottom-20 au lieu de bottom-6) */}
//           <button
//             onClick={handleOpenNewChatModal}
//             className="absolute bottom-20 right-6 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all z-10"
//           >
//             <Plus size={26} strokeWidth={2.5} />
//           </button>
//         </aside>

//         <main className="flex-1 flex flex-col bg-white">
//           {currentChat ? (
//             <>
//               <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-indigo-50/30 to-purple-50/30 flex-shrink-0">
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center gap-4">
//                     {/* ✅ Utiliser AvatarDisplay pour le header du chat */}
//                     <AvatarDisplay
//                       name={currentChat.user.fullName}
//                       avatar={currentChat.user.avatar}
//                       size="md"
//                       showBorder={false}
//                     />
//                     <div>
//                       <h3 className="text-lg font-bold text-slate-800">{currentChat.user.fullName}</h3>
//                       <p className="text-sm text-slate-600 flex items-center gap-2">
//                         {currentChat.user.type} • 
//                         <span className="flex items-center gap-1.5 text-green-500 text-xs">
//                           <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//                           En ligne
//                         </span>
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex gap-3">
//                     <button className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-all hover:-translate-y-0.5">
//                       <Phone size={18} />
//                     </button>
//                     <button className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-all hover:-translate-y-0.5">
//                       <Video size={18} />
//                     </button>
//                     <button className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-all hover:-translate-y-0.5">
//                       <Settings size={18} />
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
//                 {messages.length === 0 ? (
//                   <div className="flex items-center justify-center h-full">
//                     <div className="text-center text-slate-400">
//                       <div className="text-6xl mb-4">💬</div>
//                       <h3 className="text-xl font-semibold text-slate-600 mb-2">Aucun message</h3>
//                       <p className="text-base text-slate-500">Commencez une conversation avec ce contact</p>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="flex items-center my-5">
//                       <div className="flex-1 h-px bg-slate-200"></div>
//                       <span className="px-4 text-xs font-medium text-slate-500 bg-white">Aujourd'hui</span>
//                       <div className="flex-1 h-px bg-slate-200"></div>
//                     </div>

//                     {messages.map((message) => {
//                       const isSent = message.fromId === currentUserId;
                      
//                       // 🔍 DEBUG : Afficher les infos de chaque message
//                       console.log('🔍 Message à afficher:', {
//                         id: message.id,
//                         isSent,
//                         fromId: message.fromId,
//                         'message.from.avatar': message.from.avatar,
//                         'myAvatar': myAvatar,
//                         'Avatar utilisé': isSent ? myAvatar : message.from.avatar
//                       });
                      
//                       return (
//                         <div
//                           key={message.id}
//                           className={`flex gap-3 mb-4 ${isSent ? 'flex-row-reverse' : ''}`}
//                         >
//                           {/* ✅ Utiliser AvatarBadge pour les messages */}
//                           <AvatarBadge
//                             name={isSent ? (currentUser?.fullName || 'Vous') : message.from.fullName}
//                             avatar={isSent ? currentUser?.avatar : message.from.avatar}
//                             size="sm"
//                           />
//                           <div className="flex flex-col gap-1 max-w-[70%]">
//                             <div
//                               className={`px-4 py-3 text-sm leading-relaxed break-words ${
//                                 isSent
//                                   ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-[18px] rounded-br-md'
//                                   : 'bg-slate-100 text-slate-800 rounded-[18px] rounded-bl-md'
//                               }`}
//                             >
//                               {message.content}
//                             </div>
//                             <div className={`text-xs text-slate-400 px-1 flex items-center gap-1 ${isSent ? 'justify-end' : ''}`}>
//                               <span>{formatTime(message.sentAt)}</span>
//                               {isSent && <span className="text-slate-400">✓✓</span>}
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}

//                     {isTyping && (
//                       <div className="flex gap-3 mb-4">
//                         {/* ✅ Utiliser AvatarBadge pour l'indicateur de frappe */}
//                         <AvatarBadge
//                           name={currentChat.user.fullName}
//                           avatar={currentChat.user.avatar}
//                           size="sm"
//                         />
//                         <div className="bg-slate-100 px-4 py-3 rounded-[18px] rounded-bl-md">
//                           <div className="flex gap-1">
//                             <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
//                             <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
//                             <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </>
//                 )}
//                 <div ref={messagesEndRef} />
//               </div>

//               {/* ✅ Zone d'envoi avec flex-shrink-0 pour toujours être visible */}
//               <div className="px-6 py-5 border-t border-slate-200 bg-slate-50 flex-shrink-0">
//                 <div className="flex items-end gap-3">
//                   <div className="flex gap-2">
//                     <button className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
//                       <Paperclip size={18} />
//                     </button>
//                     <button className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
//                       <ImageIcon size={18} />
//                     </button>
//                     <button className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
//                       <Smile size={18} />
//                     </button>
//                   </div>

//                   <textarea
//                     ref={textareaRef}
//                     className="flex-1 min-h-[40px] max-h-[120px] px-4 py-3 border-2 border-slate-200 rounded-[20px] resize-none focus:outline-none focus:border-indigo-500 transition-colors bg-white text-sm font-normal"
//                     placeholder="Tapez votre message..."
//                     value={newMessage}
//                     onChange={handleTextareaChange}
//                     onKeyPress={(e) => {
//                       if (e.key === 'Enter' && !e.shiftKey) {
//                         e.preventDefault();
//                         handleSendMessage();
//                       }
//                     }}
//                     rows={1}
//                   />

//                   <button
//                     className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white hover:scale-105 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//                     onClick={handleSendMessage}
//                     disabled={!newMessage.trim() || !isConnected}
//                   >
//                     <Send size={18} />
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
//               <div className="text-6xl mb-4">💬</div>
//               <h3 className="text-2xl font-semibold text-slate-700 mb-2">Sélectionnez une conversation</h3>
//               <p className="text-base text-slate-500">ou créez-en une nouvelle avec le bouton +</p>
//             </div>
//           )}
//         </main>
//       </div>

//       {showNewChatModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowNewChatModal(false)}>
//           <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
//             <div className="p-6 border-b border-slate-200">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-xl font-bold text-slate-800">Nouvelle discussion</h3>
//                 <button
//                   onClick={() => setShowNewChatModal(false)}
//                   className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
//                 <input
//                   type="text"
//                   className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
//                   placeholder="Rechercher un ami..."
//                   value={friendSearchTerm}
//                   onChange={(e) => setFriendSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
//               {loadingFriends ? (
//                 <div className="text-center py-8">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
//                   <p className="text-sm text-slate-500">Chargement...</p>
//                 </div>
//               ) : filteredFriends.length === 0 ? (
//                 <div className="text-center py-12 text-slate-500">
//                   <div className="text-5xl mb-3">👥</div>
//                   <p className="text-sm font-medium text-slate-700">Aucun ami disponible</p>
//                   <p className="text-xs mt-1.5 text-slate-400">Ajoutez des amis pour discuter</p>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   {filteredFriends.map((friend) => (
//                     <div
//                       key={friend.id}
//                       onClick={() => handleStartNewChat(friend)}
//                       className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
//                     >
//                       {/* ✅ Utiliser AvatarDisplay pour la liste d'amis */}
//                       <AvatarDisplay
//                         name={friend.fullName}
//                         avatar={friend.avatar}
//                         size="md"
//                         showBorder={false}
//                       />
//                       <div className="flex-1 min-w-0">
//                         <div className="font-semibold text-slate-800">{friend.fullName}</div>
//                         <div className="text-sm text-slate-500">{friend.type}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       <style jsx global>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f7fafc;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #cbd5e0;
//           border-radius: 3px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #a0aec0;
//         }
//       `}</style>
//     </>
//   );
// }
"use client";

import { useState, useEffect, useRef } from 'react';
import { Send, Search, Plus, X, Paperclip, Image, Smile, Phone, Video, Settings, File, Download } from 'lucide-react';

// Composant simple pour afficher les avatars
const AvatarBadge = ({ name, avatar, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      'linear-gradient(135deg, #48bb78, #38a169)',
      'linear-gradient(135deg, #ed8936, #dd6b20)',
      'linear-gradient(135deg, #667eea, #764ba2)',
      'linear-gradient(135deg, #e53e3e, #c53030)',
      'linear-gradient(135deg, #9f7aea, #805ad5)'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (avatar) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0`}>
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}
      style={{ background: getAvatarColor(name) }}
    >
      {getInitials(name)}
    </div>
  );
};

// Composant Emoji Picker simple
const EmojiPicker = ({ onSelect, onClose }) => {
  const emojis = [
    '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂',
    '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛',
    '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
    '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫',
    '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳',
    '❤️', '💕', '💖', '💗', '💙', '💚', '💛', '🧡', '💜', '🖤',
    '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '👏', '🙌', '👐',
    '🔥', '✨', '💫', '⭐', '🌟', '💥', '💯', '✅', '❌', '⚠️'
  ];

  return (
    <div className="absolute bottom-14 left-0 bg-white rounded-xl shadow-xl border border-slate-200 p-3 w-72 z-50">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-slate-700">Emojis</span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X size={16} />
        </button>
      </div>
      <div className="grid grid-cols-10 gap-1 max-h-48 overflow-y-auto">
        {emojis.map((emoji, i) => (
          <button
            key={i}
            onClick={() => onSelect(emoji)}
            className="text-2xl hover:bg-slate-100 rounded p-1 transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

// Composant pour afficher les messages avec fichiers
const MessageContent = ({ message, isSent, formatTime }) => {
  const isImage = message.type === 'IMAGE' || (message.mimeType && message.mimeType.startsWith('image/'));
  const isFile = message.type === 'FILE' || (message.fileUrl && !isImage);

  return (
    <div className={`flex gap-3 mb-4 ${isSent ? 'flex-row-reverse' : ''}`}>
      <AvatarBadge
        name={message.from.fullName}
        avatar={message.from.avatar}
        size="sm"
      />
      <div className="flex flex-col gap-1 max-w-[70%]">
        {isImage && message.fileUrl && (
          <div className="rounded-xl overflow-hidden">
            <img 
              src={message.fileUrl} 
              alt={message.fileName || 'Image'} 
              className="max-w-full h-auto max-h-96 object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.fileUrl, '_blank')}
            />
          </div>
        )}
        
        {isFile && message.fileUrl && (
          <a
            href={message.fileUrl}
            download={message.fileName}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
              isSent ? 'bg-indigo-100' : 'bg-slate-100'
            } hover:opacity-80 transition-opacity`}
          >
            <File size={24} className={isSent ? 'text-indigo-600' : 'text-slate-600'} />
            <div className="flex-1 min-w-0">
              <div className={`font-medium truncate ${isSent ? 'text-indigo-900' : 'text-slate-900'}`}>
                {message.fileName}
              </div>
              {message.fileSize && (
                <div className={`text-xs ${isSent ? 'text-indigo-600' : 'text-slate-500'}`}>
                  {(message.fileSize / 1024).toFixed(1)} KB
                </div>
              )}
            </div>
            <Download size={18} className={isSent ? 'text-indigo-600' : 'text-slate-600'} />
          </a>
        )}
        
        {message.content && (
          <div
            className={`px-4 py-3 text-sm leading-relaxed break-words ${
              isSent
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-[18px] rounded-br-md'
                : 'bg-slate-100 text-slate-800 rounded-[18px] rounded-bl-md'
            }`}
          >
            {message.content}
          </div>
        )}
        
        <div className={`text-xs text-slate-400 px-1 flex items-center gap-1 ${isSent ? 'justify-end' : ''}`}>
          <span>{formatTime(message.sentAt)}</span>
          {isSent && <span className="text-slate-400">✓✓</span>}
        </div>
      </div>
    </div>
  );
};

export default function MessagesPage({ currentUserId, currentUser }) {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [friends, setFriends] = useState([]);
  const [friendSearchTerm, setFriendSearchTerm] = useState('');
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (currentChat) {
      loadMessages(currentChat.user.id);
    }
  }, [currentChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/messages/conversations');
      if (!response.ok) throw new Error('Erreur chargement');
      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (userId) => {
    try {
      const response = await fetch(`/api/messages/${userId}`);
      if (!response.ok) throw new Error('Erreur chargement messages');
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const loadFriends = async () => {
    try {
      const response = await fetch('/api/friends');
      if (!response.ok) throw new Error('Erreur chargement amis');
      const data = await response.json();
      setFriends(data.friends || []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSendMessage = async (messageData = {}) => {
    const content = messageData.content || newMessage.trim();
    if (!content && !messageData.fileUrl) return;
    if (!currentChat) return;

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toId: currentChat.user.id,
          content,
          type: messageData.type || 'TEXT',
          fileUrl: messageData.fileUrl,
          fileName: messageData.fileName,
          fileSize: messageData.fileSize,
          mimeType: messageData.mimeType,
          publicId: messageData.publicId  // Inclure le public ID
        })
      });

      if (!response.ok) throw new Error('Erreur envoi');
      
      const data = await response.json();
      setMessages(prev => [...prev, data.message]);
      setNewMessage('');
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Erreur envoi:', error);
      alert('Erreur lors de l\'envoi du message');
    }
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/messages/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur upload');
      }

      const data = await response.json();
      
      await handleSendMessage({
        content: type === 'IMAGE' ? '📷 Image' : `📎 ${data.fileName}`,
        type: data.messageType || type,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        publicId: data.publicId  // Inclure le public ID Cloudinary
      });
    } catch (error) {
      console.error('Erreur upload:', error);
      alert(error.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFriends = friends.filter(friend =>
    friend.fullName.toLowerCase().includes(friendSearchTerm.toLowerCase()) &&
    !conversations.some(c => c.user.id === friend.id)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-50 to-slate-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="h-full bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex">
        <aside className="w-[350px] bg-white border-r border-slate-200 flex flex-col relative">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pb-20">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-sm">Aucune conversation</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.user.id}
                  className={`flex items-center gap-4 p-4 cursor-pointer transition-all border-b border-slate-50 ${
                    currentChat?.user.id === conv.user.id 
                      ? 'bg-gradient-to-r from-indigo-50/70 to-purple-50/70' 
                      : 'hover:bg-slate-50'
                  }`}
                  onClick={() => setCurrentChat(conv)}
                >
                  <AvatarBadge name={conv.user.fullName} avatar={conv.user.avatar} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-800">{conv.user.fullName}</div>
                    <div className="text-sm text-slate-500 truncate">{conv.lastMessage.content}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => { setShowNewChatModal(true); loadFriends(); }}
            className="absolute bottom-20 right-6 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"
          >
            <Plus size={26} />
          </button>
        </aside>

        <main className="flex-1 flex flex-col bg-white">
          {currentChat ? (
            <>
              <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-indigo-50/30 to-purple-50/30">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <AvatarBadge name={currentChat.user.fullName} avatar={currentChat.user.avatar} />
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{currentChat.user.fullName}</h3>
                      <p className="text-sm text-slate-600">{currentChat.user.type}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200">
                      <Phone size={18} />
                    </button>
                    <button className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200">
                      <Video size={18} />
                    </button>
                    <button className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200">
                      <Settings size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-slate-400">
                      <div className="text-6xl mb-4">💬</div>
                      <h3 className="text-xl font-semibold">Aucun message</h3>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <MessageContent
                        key={message.id}
                        message={message}
                        isSent={message.fromId === currentUserId}
                        formatTime={formatTime}
                      />
                    ))}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="px-6 py-5 border-t border-slate-200 bg-slate-50 relative">
                {showEmojiPicker && (
                  <EmojiPicker
                    onSelect={handleEmojiSelect}
                    onClose={() => setShowEmojiPicker(false)}
                  />
                )}
                
                <div className="flex items-end gap-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
                    >
                      <Paperclip size={18} />
                    </button>
                    <button
                      onClick={() => imageInputRef.current?.click()}
                      disabled={uploading}
                      className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
                    >
                      <Image size={18} />
                    </button>
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      <Smile size={18} />
                    </button>
                  </div>

                  <textarea
                    ref={textareaRef}
                    className="flex-1 min-h-[40px] max-h-[120px] px-4 py-3 border-2 border-slate-200 rounded-[20px] resize-none focus:outline-none focus:border-indigo-500 transition-colors bg-white"
                    placeholder={uploading ? "Envoi en cours..." : "Tapez votre message..."}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    disabled={uploading}
                    rows={1}
                  />

                  <button
                    className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white hover:scale-105 transition-all disabled:opacity-50"
                    onClick={() => handleSendMessage()}
                    disabled={(!newMessage.trim() && !uploading) || uploading}
                  >
                    <Send size={18} />
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'FILE')}
                />
                <input
                  ref={imageInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'IMAGE')}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-2xl font-semibold text-slate-700">Sélectionnez une conversation</h3>
              </div>
            </div>
          )}
        </main>
      </div>

      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowNewChatModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Nouvelle discussion</h3>
                <button onClick={() => setShowNewChatModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <input
                type="text"
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl"
                placeholder="Rechercher..."
                value={friendSearchTerm}
                onChange={(e) => setFriendSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  onClick={() => {
                    setCurrentChat({
                      user: friend,
                      lastMessage: { id: '', content: '', sentAt: new Date().toISOString(), fromId: currentUserId, from: friend },
                      unreadCount: 0
                    });
                    setMessages([]);
                    setShowNewChatModal(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  <AvatarBadge name={friend.fullName} avatar={friend.avatar} />
                  <div>
                    <div className="font-semibold">{friend.fullName}</div>
                    <div className="text-sm text-slate-500">{friend.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}