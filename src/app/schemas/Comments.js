import { model, Schema } from 'mongoose';

const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    avatar_id: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default model('Comment', CommentSchema);
