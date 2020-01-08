import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';

class AuthController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Invalid schema' });

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [{ model: File, as: 'avatar' }],
    });

    if (!user) return res.status(400).json({ error: 'Email does not exists' });

    if (!(await user.checkPassword(password)))
      return res.status(400).json({ error: 'Password does not match' });

    const { id, username, youtuber, avatar } = user;

    return res.json({
      user: {
        id,
        username,
        email,
        youtuber,
        avatar,
      },
      token: user.generateToken(),
    });
  }
}

export default new AuthController();
