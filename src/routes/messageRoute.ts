// // import express from 'express';
// // import MessageModel from '../models/message';

// // const router = express.Router();

// // // Fetch messages between two users
// // router.get('/messages/:user1/:user2', async (req, res) => {
// //     const { user1, user2 } = req.params;
// //     const messages = await MessageModel.find({
// //         $or: [
// //             { sender: user1, receiver: user2 },
// //             { sender: user2, receiver: user1 },
// //         ],
// //     }).sort('timestamp');
// //     res.json(messages);
// // });

// // // Send a message
// // router.post('/messages', async (req, res) => {
// //     const message = new MessageModel(req.body);
// //     await message.save();
// //     res.status(201).json(message);
// // });

// // // Update message status
// // router.patch('/messages/:id', async (req, res) => {
// //     const { id } = req.params;
// //     const { status } = req.body;
// //     const message = await MessageModel.findByIdAndUpdate(id, { status }, { new: true });
// //     res.json(message);
// // });

// // export default router;
// import express, { Request, Response } from 'express';
// import Chat from '../models/chat';
// import Message from '../models/message';

// const router = express.Router();

// // Create a new chat
// router.post('/create-chat', async (req: Request, res: Response) => {
//   const { participants } = req.body;

//   try {
//     const chat = new Chat({ participants });
//     await chat.save();
//     res.status(201).json(chat);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to create chat' });
//   }
// });

// // Send a message in a chat
// // router.post('/send-message', async (req: Request, res: Response) => {
// //   const { chatId, senderId, text } = req.body;

// //   try {
// //     const message = new Message({
// //       chat: chatId,
// //       sender: senderId,
// //       text,
// //     });

// //     await message.save();
// //     res.status(201).json(message);
// //   } catch (error) {
// //     res.status(500).json({ error: 'Failed to send message' });
// //   }
// // });
// // router.post('/send-message', async (req, res) => {
// //   try {
// //     const { chatId, text, fromMe } = req.body;

// //     const message = {
// //       text,
// //       timestamp: new Date(),
// //       status: 'sent',
// //       fromMe,
// //     };

// //     // Find the chat by ID and push the new message to the messages array
// //     const updatedChat = await Chat.findByIdAndUpdate(
// //       chatId,
// //       { $push: { messages: message } },
// //       { new: true }
// //     );

// //     if (!updatedChat) {
// //       return res.status(404).json({ message: 'Chat not found' });
// //     }

// //     return res.status(200).json(updatedChat);
// //   } catch (error) {
// //     console.error('Error sending message:', error);
// //     return res.status(500).json({ message: 'Failed to send message', error });
// //   }
// // });
// // Get messages for a chat
// router.get('/get-messages/:chatId', async (req: Request, res: Response) => {
//   const { chatId } = req.params;

//   try {
//     const messages = await Message.find({ chat: chatId }).populate('sender', 'username');
//     res.status(200).json(messages);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to retrieve messages' });
//   }
// });

// router.get('/get-user-messages/:userId', async (req: Request, res: Response) => {
//   const { userId } = req.params;

//   try {
//     // Find all chats for the user
//     const chats = await Chat.find({
//       participants: userId,
//     });

//     // Fetch messages for each chat
//     const messages = await Promise.all(
//       chats.map((chat) => Message.find({ chat: chat._id }).populate('sender', 'username'))
//     );

//     res.status(200).json({ chats, messages });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to retrieve user messages' });
//   }
// });

// export default router;