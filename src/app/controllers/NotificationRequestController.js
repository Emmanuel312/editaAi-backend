import RequestNotification from '../schemas/RequestNotification';

import User from '../models/User';
import Service from '../models/Service';

class NotificationController {
  async index(req, res) {
    const user = await User.findByPk(req.userId);

    if (user.youtuber) {
      return res
        .status(401)
        .json({ error: 'Only editors can see request Notifications' });
    }

    // Query to find all user's services that isn't confirmmed
    const servicesNotConfirmed = await Service.findAll({
      where: { user_id: req.userId, confirmed: false },
      attributes: ['id'],
    });

    const servicesNotConfirmedArray = servicesNotConfirmed.map(({ id }) => id);

    const notifications = await RequestNotification.find({
      service_id: { $in: servicesNotConfirmedArray },
    });

    return res.json(notifications);
  }
}

export default new NotificationController();
