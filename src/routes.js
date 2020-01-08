import { Router } from 'express';
import requireDir from 'require-dir';
import multer from 'multer';
import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

const upload = multer(multerConfig);
// RequireDir create a key with name default ( blame sucrase )
const Controllers = requireDir('./app/controllers', {
  mapValue: value => {
    return Object.values(value)[0];
  },
});

class Routes {
  constructor() {
    this.router = Router();

    this.routes();
  }

  routes() {
    this.router.post('/session', Controllers.SessionController.store);
    this.router.post('/users', Controllers.UserController.store);

    this.router.use(authMiddleware);

    this.router.post('/services', Controllers.ServiceController.store);
    this.router.put(
      '/services/:service_id',
      Controllers.ServiceController.update
    );
    this.router.post(
      '/files',
      upload.single('file'),
      Controllers.FileController.store
    );
    this.router.get('/user', Controllers.UserController.show);

    this.router.get(
      '/requestNotifications',
      Controllers.NotificationRequestController.index
    );
    this.router.get(
      '/confirmNotifications',
      Controllers.NotificationConfirmController.index
    );
    this.router.post('/comments', Controllers.CommentController.store);
    this.router.get(
      '/service/:service_id/comments',
      Controllers.CommentController.index
    );
  }
}

export default new Routes().router;
