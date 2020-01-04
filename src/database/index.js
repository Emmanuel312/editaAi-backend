import Sequelize from 'sequelize';
import requireDir from 'require-dir';
import mongoose from 'mongoose';
import databaseConfig from '../config/database';
// RequireDir create a key with name default ( blame sucrase )
const Models = requireDir('../app/models', {
  mapValue: value => {
    return Object.values(value)[0];
  },
});

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    this.models = Object.values(Models);

    this.models.forEach(model => model.init(this.connection));
    this.models.forEach(
      model => model.associate && model.associate(this.connection.models)
    );
  }

  mongo() {
    this.mongoConnection = mongoose.connect('mongodb://localhost/editaAi', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

export default new Database();
