module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'docker',
  database: 'edita_ai',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
