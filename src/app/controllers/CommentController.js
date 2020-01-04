import * as Yup from 'yup';
import Comment from '../models/Comment';
import User from '../models/User';
import File from '../models/File';

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
          attributes: ['id'],
          include: [
            { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
          ],
        },
      ],
    });

    return res.json(commentWithAvatar);
  }
}

export default new CommentController();
