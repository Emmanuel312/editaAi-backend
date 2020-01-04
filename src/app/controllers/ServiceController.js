import * as Yup from 'yup';
import User from '../models/User';
import Service from '../models/Service';
import File from '../models/File';

class ServiceController {
  // youtuber request a service
  async store(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Invalid schema' });

    const user = await User.findOne({
      where: { id: req.userId },
      include: [
        { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
      ],
    });

    if (!user.youtuber) {
      return res
        .status(401)
        .json({ error: 'Only youtubers are permitted to request a service' });
    }

    const { user_id } = req.body;

    const service = await Service.create({ user_id, youtuber_id: req.userId });

    await service.addRequestNotification(user.avatar.url, user.username);

    return res.json({ service });
  }

  // editor confirm a service
  async update(req, res) {
    const schema = Yup.object().shape({
      service_id: Yup.number()
        .positive()
        .required(),
    });

    const { service_id } = req.params;

    if (!(await schema.isValid({ ...req.body, service_id })))
      return res.status(400).json({ error: 'Invalid schema' });

    const user = await User.findOne({
      where: { id: req.userId },
      include: [
        { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
      ],
    });

    if (user.youtuber) {
      return res
        .status(401)
        .json({ error: 'Only editors are permitted to confirm a service' });
    }

    // confirm the service was requested to current editor
    const owner = await Service.findOne({
      where: { id: service_id, user_id: req.userId },
    });

    if (!owner)
      return res.status(401).json({
        error:
          'Service does not exists or only editor that was requested can confirm this service',
      });

    owner.confirmed = true;

    await owner.save();
    await owner.addConfirmNotification(user.username, user.avatar.url);

    return res.json(owner);
  }
}

export default new ServiceController();
