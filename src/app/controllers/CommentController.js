import * as Yup from 'yup';
import Comment from '../models/Comment';
import User from '../models/User';
import File from '../models/File';
import Service from '../models/Service';

class CommentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      content: Yup.string(),
      service_id: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Invalid schema' });

    const comment = await Comment.create({ ...req.body, user_id: req.userId });

    const commentWithAvatar = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'youtuber'],
          include: [
            { model: File, as: 'avatar', attributes: ['id', 'path', 'url'] },
          ],
        },
      ],
    });

    return res.json(commentWithAvatar);
  }

  async index(req, res) {
    const service = await Service.findOne({
      where: { id: req.params.service_id },
      attributes: ['id', 'youtuber_id'],
      include: [
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'youtuber', 'username'],
              include: [
                {
                  model: File,
                  as: 'avatar',
                  attributes: ['url', 'path', 'id'],
                },
              ],
            },
          ],
        },
      ],
    });
    const { username } = await User.findByPk(service.youtuber_id);
    return res.json({ youtuberUsername: username, service });
  }
}

export default new CommentController();
