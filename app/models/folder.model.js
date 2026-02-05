module.exports = (sequelize, DataTypes) => {
  const Folder = sequelize.define(
    "Folder",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "name",
      },
      classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "class_id",
        references: {
          model: "classes",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
        references: {
          model: "users",
          key: "id",
        },
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "parent_id",
        references: {
          model: "folders",
          key: "id",
        },
      },
      orderIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "order_index",
      },
    },
    {
      tableName: "folders",
      timestamps: true,
    }
  );

  Folder.associate = function(models) {
    Folder.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Folder.belongsTo(models.Class, {
      foreignKey: 'classId',
      as: 'class'
    });
    Folder.belongsTo(models.Folder, {
      foreignKey: 'parentId',
      as: 'parent'
    });
    Folder.hasMany(models.Folder, {
      foreignKey: 'parentId',
      as: 'children'
    });
    Folder.hasMany(models.Lesson, {
      foreignKey: 'folderId',
      as: 'lessons'
    });
  };

  return Folder;
};
