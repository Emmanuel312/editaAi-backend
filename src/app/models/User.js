import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Auth from '../../config/auth';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        username: DataTypes.STRING,
        email: DataTypes.STRING,
        youtuber: DataTypes.BOOLEAN,
        password: DataTypes.VIRTUAL,
        password_hash: DataTypes.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.password)
        user.password_hash = await bcrypt.hash(user.password, 8);
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  generateToken() {
    return jwt.sign({ id: this.id }, Auth.secret, {
      expiresIn: Auth.expiresIn,
    });
  }

  static associate(models) {
    this.hasMany(models.Service, {
      foreignKey: 'user_id',
      as: 'user_services',
    });
    this.hasMany(models.Service, {
      foreignKey: 'youtuber_id',
      as: 'youtuber_services',
    });
    this.belongsTo(models.File, {
      foreignKey: 'avatar_id',
      as: 'avatar',
    });
  }
}

export default User;
