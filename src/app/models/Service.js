import { DataTypes, Model } from 'sequelize';
import RequestNotification from '../schemas/RequestNotification';
import ConfirmNotification from '../schemas/ConfirmNotification';

class Service extends Model {
  static init(sequelize) {
    super.init(
      {
        done: DataTypes.STRING,
        confirmed: DataTypes.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  addRequestNotification(youtuber_avatar_url, username) {
    const content = `@${username} pediu para vocẽ editar o video dele(a)`;
    return RequestNotification.create({
      service_id: this.id,
      user_id: this.user_id,
      youtuber_avatar_url,
      content,
    });
  }

  addConfirmNotification(username, user_avatar_url) {
    const title = 'Confirmação de Edição';
    const body = `@${username} aceitou seu pedido de edição`;
    return ConfirmNotification.create({
      title,
      body,
      user_avatar_url,
      youtuber_id: this.youtuber_id,
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'service_user' });
    this.belongsTo(models.User, {
      foreignKey: 'youtuber_id',
      as: 'service_youtuber',
    });
    this.hasMany(models.Comment, { foreignKey: 'service_id', as: 'comments' });
  }
}

export default Service;
