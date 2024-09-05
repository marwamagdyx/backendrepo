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
// router.post('/send-message', async (req: Request, res: Response) => {
//   const { chatId, senderId, text } = req.body;

//   try {
//     const message = new Message({
//       chat: chatId,
//       sender: senderId,
//       text,
//     });

//     await message.save();
//     res.status(201).json(message);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to send message' });
//   }
// });

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

// export default router;
// import { Request, Response } from 'express';
// import Message from '../models/message';

// // Function to save a new message
// export const saveMessage = async (messageData: any) => {
//   try {
//     const message = new Message(messageData);
//     await message.save();
//     console.log('Message saved:', message);
//   } catch (error) {
//     console.error('Error saving message:', error);
//   }
// };

// // Function to get messages between two users
// export const getMessages = async (req: Request, res: Response) => {
//   const { senderId, receiverId } = req.query;

//   try {
//     const messages = await Message.find({
//       $or: [
//         { senderId, receiverId },
//         { senderId: receiverId, receiverId: senderId }
//       ]
//     }).sort({ timestamp: 1 });

//     res.status(200).json(messages);
//   } catch (error) {
//     console.error('Error fetching messages:', error);
//     res.status(500).json({ error: 'Failed to fetch messages' });
//   }
// };
import express, { Request, Response } from 'express';
import Chat from '../models/chat';
import Message from '../models/message';
import mongoose, { Document, Schema, Model } from 'mongoose';
import User from '../models/User';

const router = express.Router();

router.get('/auth/users', async (req: Request, res: Response) => {
  try {
    const _users = await User.find(); // Adjust the fields as needed
    const users = _users.map((user) => {
      // @ts-ignore
      return {
        ...user.toJSON(),
        name: user.firstName + " " + user.lastName
      };
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});
// router.post('/create-chat', async (req, res) => {
//   try {
//     const { participants } = req.body;

//     // Check if a chat already exists with these participants
//     let chat = await Chat.findOne({ participants: { $all: participants } });

//     if (chat) {
//       // If chat exists, return the existing chat
//       return res.status(200).json(chat);
//     }

//     // If chat doesn't exist, create a new one
//     chat = new Chat({ participants });
//     await chat.save();

//     return res.status(201).json(chat);
//   } catch (error) {
//     console.error('Error creating chat:', error);
//     return res.status(500).json({ message: 'Error creating chat', error });
//   }
// });

router.post('/create-chat', async (req, res) => {
  try {
    const { participants } = req.body;

    // Sort participants to ensure consistent ordering
    participants.sort();

    // Check if a chat already exists with these participants
    let chat = await Chat.findOne({ participants: { $all: participants } });

    if (chat) {
      // If chat exists, return the existing chat
      return res.status(200).json(chat);
    }

    // If chat doesn't exist, create a new one
    chat = new Chat({ participants });
    await chat.save();

    return res.status(201).json(chat);
  } catch (error) {
    console.error('Error creating chat:', error);
    return res.status(500).json({ message: 'Error creating chat', error });
  }
});
// Send a message in a chat
router.post('/send-message', async (req, res) => {
  try {
    const { chatId, text, fromMe } = req.body;

    const message = {
      text,
      timestamp: new Date(),
      status: 'sent',
      fromMe,
    };

    // Find the chat by ID and push the new message to the messages array
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { messages: message } }, // Directly push the message object
      { new: true }
    );

    if (!updatedChat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    return res.status(200).json(updatedChat);
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ message: 'Failed to send message', error });
  }
});

// Get messages for a chat
router.get('/get-messages/:chatId', async (req: Request, res: Response) => {
  // const { chatId } = req.body;
  const chatId = req.params.chatId;
  console.log(`Fetching messages for chat ID: ${chatId}`);
  const chat = await Chat.findById(chatId); // Assuming Chat is your chat model
  if (!chat) {
    console.error(`Chat not found for ID: ${chatId}`);
    return res.status(404).send({ error: 'Chat not found' });
  }
  const messages = await Message.find({ chatId });
  res.send(messages);
});
// Fetch all chats for a user
router.get('/fetch-chats', async (req: Request, res: Response) => {
  const { userId } = req.query;

  try {
    const chats = await Chat.find({ participants: userId }).populate('participants', 'username');// Debug log to verify data
    res.status(200).json(chats);
  } catch (error) {
    console.error('Failed to fetch chats:', error); // Better error logging
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

const validateObjectIds = (ids: string[]) => {
  return ids.every(id => mongoose.Types.ObjectId.isValid(id));
};

// router.post('/get-chat', async (req, res) => {
//   try {
//     const { participantIds } = req.body;
//     if (!validateObjectIds(participantIds)) {
//       return res.status(400).json({ message: 'Invalid ObjectId format' });
//     }
//     // Convert participant IDs to ObjectId, ensuring they are valid
//     const objectIds = participantIds.map((id: string) => {
//       if (!mongoose.Types.ObjectId.isValid(id)) {
//         throw new Error(`Invalid ObjectId: ${id}`);
//       }
//       return new mongoose.Types.ObjectId(id);
//     });

//     // const chat = await Chat.findOne({ participants: { $all: objectIds } }).populate('messages');
//     const chat = await Chat.findOne({
//       participants: { $all: participantIds }
//     }).populate('messages');
//     if (!chat) {
//       return res.status(404).json({ message: 'Chat not found' });
//     }

//     res.status(200).json(chat);
//   } catch (error) {
//     console.error('Error fetching chat:', error); // Improved error logging
//     res.status(500).json({ message: 'Failed to fetch chat', error }); // Include the error in response
//   }
// });

router.post('/get-chat', async (req, res) => {
  try {
    const { participantIds } = req.body;

    if (!validateObjectIds(participantIds)) {
      return res.status(400).json({ message: 'Invalid ObjectId format' });
    }

    // Sort participants to ensure consistent ordering
    participantIds.sort();

    // Convert participant IDs to ObjectId
    const objectIds = participantIds.map((id: string) => new mongoose.Types.ObjectId(id));

    // Find the chat with these participants
    const chat = await Chat.findOne({ participants: { $all: objectIds } }).populate('messages');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ message: 'Failed to fetch chat', error });
  }
});
export default router;