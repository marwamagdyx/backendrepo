import express, { Request, Response } from 'express';
import mongoose, { Document, Schema, Model } from 'mongoose';
import { Chat } from '../models/chat';
import User from '../models/User';
import Message from '../models/message';

const router = express.Router();

// Fetch users
router.get('/auth/users', async (req: Request, res: Response) => {
  try {
    const _users = await User.find(); // Adjust the fields as needed
    const users = _users.map((user) => {
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

// Create chat
router.post('/create-chat', async (req, res) => {
  try {
    const { participants } = req.body;

    // Sort participants to ensure consistent ordering
    participants.sort();

    // Check if a chat already exists with these participants
    let chat = await Chat.findOne({ participants: { $all: participants } });

    if (chat) {
      return res.status(200).json(chat); // Return the existing chat
    }

    // Create a new chat if it doesn't exist
    chat = new Chat({
      participants,
      messages: [],
    });
    await chat.save();

    return res.status(201).json(chat);
  } catch (error) {
    console.error('Error creating chat:', error);
    return res.status(500).json({ message: 'Error creating chat', error });
  }
});

// Send message
// Modify the 'send-message' route
router.post('/send-message', async (req, res) => {
  try {
    const { chatId, text, sender } = req.body;

    if (!chatId || !text || !sender) {
      return res.status(400).json({ message: 'Chat ID, text, and sender are required' });
    }

    const existingChat = await Chat.findById(chatId);
    if (!existingChat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const message = new Message({
      chatId,
      text,
      timestamp: new Date(),
      status: 'sent',
      sender, // Correct sender ID
    });

    await message.save();
    existingChat.messages.push(message._id);
    await existingChat.save();

    req.app.get('io').to(chatId).emit('receiveMessage', message); // Emit the message via Socket.IO

    return res.status(200).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
});

// Fetch messages
router.get('/get-messages/:chatId', async (req: Request, res: Response) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          select: '_id'  // Ensure we are only fetching the ID
        },
      });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.json(chat.messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});
router.post('/get-chat', async (req, res) => {
  try {
    const { participantIds } = req.body;


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
