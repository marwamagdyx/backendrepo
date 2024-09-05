// import express from 'express';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import authRoutes from './routes/auth';
// import cors from 'cors';



// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors({
//   origin: 'http://localhost:3000', // Replace with your frontend URL
// }));
// // Middleware
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI!)
//     .then(() => {
//         console.log('MongoDB connected');
//         app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
//     })
//     .catch((error) => {
//         console.error('MongoDB connection error:', error);
//     });


// export default app;


// import express from 'express';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import authRoutes from './routes/auth';
// import cors from 'cors';
// import http from 'http';
// import { Server } from 'socket.io';


// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors({
//   origin: 'http://localhost:3000', // Replace with your frontend URL
// }));
// // Middleware
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI!)
//     .then(() => {
//         console.log('MongoDB connected');
//         app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
//     })
//     .catch((error) => {
//         console.error('MongoDB connection error:', error);
//     });




//     const server = http.createServer(app);
// const io = new Server(server);

// mongoose.connect('mongodb://localhost:27017/ChatApp');


// const onlineUsers = new Map();
// // Add this to handle connection events
// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('userOnline', (userId) => {
//     onlineUsers.set(userId, socket.id);
//     io.emit('onlineUsers', Array.from(onlineUsers.keys()));
// });
//   // Listen for message send events
//   socket.on('sendMessage', async (message) => {
//       // Save the message to MongoDB
//       const newMessage = new message(message);
//       await newMessage.save();

//       // Broadcast the message to the receiver
//       io.emit('messageReceived', newMessage);
//   });

//   // Handle disconnect event
//   socket.on('disconnect', () => {
//     onlineUsers.forEach((value, key) => {
//         if (value === socket.id) {
//             onlineUsers.delete(key);
//         }
//     });
//     io.emit('onlineUsers', Array.from(onlineUsers.keys()));
//     console.log('A user disconnected');
// });
// });

// // Start the server
// server.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });

// export default app;


// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import authRoutes from './routes/auth';
// import messageRoutes from './routes/messageRoute';
// import cors from 'cors';
// import jwt from 'jsonwebtoken';
// import User from './models/User';
// import MessageModel from './models/message';

// dotenv.config();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: 'http://localhost:3000',
//         methods: ['GET', 'POST'],
//     },
// });

// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors({
//   origin: 'http://localhost:3000',
// }));
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/messages', messageRoutes);

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI!)
//     .then(() => {
//         console.log('MongoDB connected');
//         server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
//     })
//     .catch((error) => {
//         console.error('MongoDB connection error:', error);
//     });

// // Online Users Map
// const onlineUsers = new Map<string, string>(); // userId -> socket.id

// // Socket.io Middleware for Authentication
// io.use(async (socket, next) => {
//     try {
//         const token = socket.handshake.auth.token;
//         if (!token) {
//             return next(new Error('Authentication error'));
//         }
//         const decoded: any = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET!);
//         socket.data.userId = decoded.userId;
//         next();
//     } catch (err) {
//         next(new Error('Authentication error'));
//     }
// });

// // Socket.io Connection Handling
// io.on('connection', (socket) => {
//     const userId = socket.data.userId;
//     console.log(`User connected: ${userId}`);

//     // Add user to online users
//     onlineUsers.set(userId, socket.id);
//     io.emit('onlineUsers', Array.from(onlineUsers.keys()));

//     // Listen for sendMessage event
//     socket.on('sendMessage', async (data) => {
//         const { receiver, message } = data;

//         // Create and save the message
//         const newMessage = new MessageModel({
//             sender: userId,
//             receiver,
//             message,
//             timestamp: new Date(),
//             status: 'sent',
//         });

//         await newMessage.save();

//         // Emit to the receiver if online
//         const receiverSocketId = onlineUsers.get(receiver);
//         if (receiverSocketId) {
//             io.to(receiverSocketId).emit('receiveMessage', newMessage);
//             // Optionally update the message status to 'delivered'
//             newMessage.status = 'delivered';
//             await newMessage.save();
//             io.to(socket.id).emit('messageDelivered', newMessage);
//         }
//     });

//     // Handle disconnect
//     socket.on('disconnect', () => {
//         onlineUsers.delete(userId);
//         io.emit('onlineUsers', Array.from(onlineUsers.keys()));
//         console.log(`User disconnected: ${userId}`);
//     });
// });
// import express from 'express';
// import http from 'http';
// import mongoose from 'mongoose';
// import chatRoutes from './routes/messageRoute';
// import socketSetup from 'socket.io';

// const app = express();
// const server = http.createServer(app);

// // Middleware
// app.use(express.json());

// // Database Connection
// mongoose.connect('mongodb://localhost/chatapp').then(() => {
//   console.log('Connected to MongoDB');}).catch((error) => {
//   console.error('MongoDB connection error:', error);
// });

// // Routes
// app.use('/api/chats', chatRoutes);

// // Socket.io setup
// socketSetup(server);

// // Start server
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// import express from 'express';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import authRoutes from './routes/auth';
// import cors from 'cors';
// import http from 'http';
// import { Server as SocketIOServer } from 'socket.io';
// import { saveMessage, getMessages } from './routes/chatRoutes';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Create HTTP server for Socket.io
// const server = http.createServer(app);

// // Initialize Socket.io server
// const io = new SocketIOServer(server, {
//   cors: {
//     origin: 'http://localhost:3000', // Replace with your frontend URL
//     methods: ['GET', 'POST'],
//   },
// });

// app.use(cors({
//   origin: 'http://localhost:3000', // Replace with your frontend URL
// }));

// // Middleware
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/chat', getMessages); // Route to fetch chat messages

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI!)
//   .then(() => {
//     console.log('MongoDB connected');
//     server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
//   })
//   .catch((error) => {
//     console.error('MongoDB connection error:', error);
//   });

// // Socket.io handling
// io.on('connection', (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   socket.on('sendMessage', async (message) => {
//     console.log('Message received:', message);
//     await saveMessage(message); // Save the message to the database
//     io.emit('receiveMessage', message); // Emit the message to all connected clients
//   });

//   socket.on('disconnect', () => {
//     console.log(`User disconnected: ${socket.id}`);
//   });
// });

// export default app;
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import chatRoutes from './routes/chatRoutes'; // Import your chat routes
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server for Socket.io
const server = http.createServer(app);

// Initialize Socket.io server
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST'],
  },
});

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', chatRoutes); // Use chat routes

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
  export const saveMessage = async (messageData: any) => {
    try {
      const Message = mongoose.model('Message');
      const message = new Message(messageData);
      await message.save();
      console.log('Message saved:', message);
      return message; // Return the saved message if needed
    } catch (error) {
      console.error('Error saving message:', error);
      throw error; // Re-throw error to handle it in calling code
    }
  };// Socket.io handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('sendMessage', async (message) => {
    console.log('Message received:', message);
    await saveMessage(message); // Save the message to the database
    io.emit('receiveMessage', message); // Emit the message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

export default app;