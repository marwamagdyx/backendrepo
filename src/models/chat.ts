// import mongoose, { Document, Schema } from 'mongoose';

// interface IChat extends Document {
//   participants: mongoose.Types.ObjectId[];
//   createdAt: Date;
// }

// const chatSchema: Schema = new Schema({
//   participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
//   createdAt: { type: Date, default: Date.now },
// });

// const Chat = mongoose.model<IChat>('Chat', chatSchema);

// export default Chat;
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
  createdAt: Date;
}
const messageSchema = new Schema({
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, required: true },
  fromMe: { type: Boolean, required: true },
});

const chatSchema = new Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [messageSchema], // Embed the message schema directly
});


const Chat: Model<IChat> = mongoose.model<IChat>('Chat', chatSchema);
export default Chat;