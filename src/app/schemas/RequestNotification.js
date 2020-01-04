import { model, Schema } from 'mongoose';

const RequestNotificationSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    youtuber_avatar_url: {
      type: String,
      required: true,
    },
    user_id: {
      type: Number,
      required: true,
    },
    service_id: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

RequestNotificationSchema.pre('save', function(next) {
  console.log('criei');
  next();
});

export default model('RequestNotification', RequestNotificationSchema);
