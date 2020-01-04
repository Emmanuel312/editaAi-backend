import { model, Schema } from 'mongoose';

const ConfirmNotificationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    user_avatar_url: {
      type: String,
      required: true,
    },
    youtuber_id: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

ConfirmNotificationSchema.pre('save', function(next) {
  console.log('criei');
  next();
});

export default model('ConfirmNotification', ConfirmNotificationSchema);
