import mongoose, { Schema, Document, Model } from 'mongoose';

// Chat Schema
export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const chatSchema = new Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  createdAt: { type: Date, default: Date.now }
});

export const Chat: Model<IChat> = mongoose.model<IChat>('Chat', chatSchema);
export default Chat;  