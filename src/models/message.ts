import mongoose, { Schema, Document, Model } from 'mongoose';

// Message Schema
const messageSchema = new Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
  text: String,
  timestamp: Date,
  status: String,
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }  // Reference to User
});

const Message = mongoose.model('Message', messageSchema);
export default Message;