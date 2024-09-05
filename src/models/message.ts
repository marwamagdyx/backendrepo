// // // src/models/Message.ts
// // import { Schema, model, Document, Types } from 'mongoose';

// // export interface IMessage extends Document {
// //   chatId: Types.ObjectId;
// //   senderId: Types.ObjectId;
// //   text: string;
// //   timestamp: Date;
// //   status: 'sent' | 'received' | 'read';
// // }

// // const messageSchema = new Schema<IMessage>({
// //   chatId: {
// //     type: Schema.Types.ObjectId,
// //     required: true,
// //     ref: 'Chat', // Assuming you have a Chat model
// //   },
// //   senderId: {
// //     type: Schema.Types.ObjectId,
// //     required: true,
// //     ref: 'User', // Assuming you have a User model
// //   },
// //   text: {
// //     type: String,
// //     required: true,
// //   },
// //   timestamp: {
// //     type: Date,
// //     default: Date.now,
// //   },
// //   status: {
// //     type: String,
// //     enum: ['sent', 'received', 'read'],
// //     default: 'sent',
// //   },
// // });

// // const Message = model<IMessage>('Message', messageSchema);

// // export default Message;
// import mongoose, { Schema, Document } from 'mongoose';

// export interface IMessage extends Document {
//   chatId: string;
//   sender: string;
//   content: string;
//   timestamp: Date;
//   status: 'sent' | 'received' | 'read';
// }

// const MessageSchema: Schema = new Schema({
//   chatId: { type: String, required: true },
//   sender: { type: String, required: true },
//   content: { type: String, required: true },
//   timestamp: { type: Date, default: Date.now },
//   status: { type: String, enum: ['sent', 'received', 'read'], default: 'sent' },
// });

// const Message = mongoose.model<IMessage>('Message', MessageSchema);

// export default Message;
// import mongoose, { Schema, Document } from 'mongoose';

// interface IMessage extends Document {
//   sender: mongoose.Types.ObjectId;
//   receiver: mongoose.Types.ObjectId;
//   content: string;
//   status: 'sent' | 'delivered' | 'read';
//   timestamp: Date;
// }

// const MessageSchema: Schema = new Schema({
//   sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   content: { type: String, required: true },
//   status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
//   timestamp: { type: Date, default: Date.now }
// });

// const Message = mongoose.model<IMessage>('Message', MessageSchema);

// export default Message;
// import mongoose, { Document, Schema } from 'mongoose';

// interface IMessage extends Document {
//   chat: mongoose.Types.ObjectId;
//   sender: mongoose.Types.ObjectId;
//   text: string;
//   timestamp: Date;
//   status: 'sent' | 'received' | 'read';
// }

// const messageSchema: Schema = new Schema({
//   chat: { type: Schema.Types.ObjectId, ref: 'Chat' },
//   sender: { type: Schema.Types.ObjectId, ref: 'User' },
//   text: { type: String, required: true },
//   timestamp: { type: Date, default: Date.now },
//   status: { type: String, enum: ['sent', 'received', 'read'], default: 'sent' },
// });

// const Message = mongoose.model<IMessage>('Message', messageSchema);

// export default Message;


import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IMessage extends Document {
  chatId: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  text: string;
  timestamp: Date;
  status: 'sent' | 'received' | 'read';
}

const messageSchema: Schema<IMessage> = new Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['sent', 'received', 'read'],
    default: 'sent',
  },
});

const Message: Model<IMessage> = mongoose.model<IMessage>('Message', messageSchema);
export default Message;