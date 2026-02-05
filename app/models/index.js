const sequelize = require("../config/db.config");
const User = require("./user.model")(sequelize, require("sequelize").DataTypes);
const ClassCategory = require("./classCategory.model")(sequelize, require("sequelize").DataTypes);
const Class = require("./class.model")(sequelize, require("sequelize").DataTypes);
const Lesson = require("./lesson.model")(sequelize, require("sequelize").DataTypes);
const LessonMedia = require("./lessonMedia.model")(sequelize, require("sequelize").DataTypes);
const Folder = require("./folder.model")(sequelize, require("sequelize").DataTypes);

const db = {};
db.sequelize = sequelize;
db.Sequelize = require("sequelize");

db.User = User;
db.ClassCategory = ClassCategory;
db.Class = Class;
db.Lesson = Lesson;
db.LessonMedia = LessonMedia;
db.Folder = Folder;

// Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
