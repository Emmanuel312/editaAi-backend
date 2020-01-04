import User from '../models/User';
import Service from '../models/Service';

import RequestNotification from '../schemas/RequestNotification';

class NotificationController {
  async index(req, res) {
    const user = await User.findByPk(req.userId);

    if (user.youtuber) {
      return res
        .status(401)
        .json({ error: 'Only editors can see confirm Notifications' });
    }

    // Query to find all user's services that isn't confirmmed
    const servicesConfirmed = await Service.findAll({
      where: { user_id: req.userId, confirmed: true, done: false },
      attributes: ['id'],
      include: [
        { model: User, as: 'service_user', attributes: ['username'] },
        { model: User, as: 'service_youtuber', attributes: ['username'] },
      ],
    });

    const servicesConfirmedArray = servicesConfirmed.map(({ id }) => id);

    const notifications = await RequestNotification.find({
      service_id: { $in: servicesConfirmedArray },
    });

    let i = 0;
    const notificationsIncludeUsername = notifications.map(notification => ({
      // eslint-disable-next-line no-underscore-dangle
      ...notification._doc,
      // eslint-disable-next-line no-plusplus
      youtuberUsername: servicesConfirmed[i++].service_youtuber.username,
      username: user.username,
    }));

    return res.json(notificationsIncludeUsername);
  }
}

export default new NotificationController();
