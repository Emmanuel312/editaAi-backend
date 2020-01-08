import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      username: Yup.string().required(),
      youtuber: Yup.boolean(),
      password: Yup.string()
        .min(6)
        .required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Invalid Schema' });

    const { username, email } = req.body;

    if (await User.findOne({ where: { email } }))
      return res.status(400).json({ error: 'Email already exists' });

    if (await User.findOne({ where: { username } }))
      return res.status(400).json({ error: 'Username already exists' });

    const { id, youtuber } = await User.create(req.body);

    return res.json({
      user: {
        id,
        youtuber,
        username,
        email,
      },
    });
  }

  async show(req, res) {
    const user = await User.findOne({
      where: { id: req.userId },
      attributes: ['id', 'username', 'email', 'youtuber'],
      include: [
        { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
      ],
    });

    return res.json(user);
  }
}

export default new UserController();
