const { Folder, Class, Lesson } = require('../models');
const { Op } = require('sequelize');

const getNextOrderIndex = async ({ classId, userId, parentId }) => {
  const maxIndex = await Folder.max('orderIndex', {
    where: { classId, userId, parentId: parentId || null }
  });
  if (maxIndex === null || maxIndex === undefined) return 0;
  return Number(maxIndex) + 1;
};

const createFolder = async (req, res) => {
  try {
    const { name, classId, parentId, orderIndex } = req.body || {};
    const userId = req.user.id;

    const newOrderIndex = Number.isInteger(orderIndex)
      ? orderIndex
      : await getNextOrderIndex({ classId, userId, parentId });

    const newFolder = await Folder.create({
      name,
      classId,
      userId,
      parentId: parentId || null,
      orderIndex: newOrderIndex
    });

    res.status(201).json(newFolder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getFolders = async (req, res) => {
  try {
    const userId = req.user.id;
    const classId = req.query.classId;

    if (!classId || isNaN(classId)) {
      return res.status(400).json({ message: 'classId query param is required' });
    }

    const classItem = await Class.findOne({ where: { id: classId, userId } });
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const folders = await Folder.findAll({
      where: { classId, userId },
      order: [['orderIndex', 'ASC'], ['id', 'ASC']]
    });

    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFolderById = async (req, res) => {
  try {
    res.status(200).json(req.folder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFolder = async (req, res) => {
  try {
    const { name } = req.body || {};
    const folder = req.folder;

    await folder.update({ name });

    res.status(200).json(folder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const reorderFolder = async (req, res) => {
  try {
    const { orderIndex } = req.body || {};
    if (orderIndex === undefined || orderIndex === null || isNaN(orderIndex)) {
      return res.status(400).json({ message: 'orderIndex is required' });
    }
    const folder = req.folder;
    await folder.update({ orderIndex: Number(orderIndex) });
    res.status(200).json(folder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const moveFolder = async (req, res) => {
  try {
    const folder = req.folder;
    const userId = req.user.id;
    const { classId, parentId, orderIndex } = req.body || {};

    let targetClassId = classId || folder.classId;
    if (isNaN(targetClassId)) {
      return res.status(400).json({ message: 'classId must be a number' });
    }

    const classItem = await Class.findOne({ where: { id: targetClassId, userId } });
    if (!classItem) {
      return res.status(404).json({ message: 'Target class not found' });
    }

    let nextParentId = parentId === undefined ? folder.parentId : (parentId || null);
    if (nextParentId) {
      const parentFolder = await Folder.findOne({ where: { id: nextParentId, userId, classId: targetClassId } });
      if (!parentFolder) {
        return res.status(400).json({ message: 'Parent folder not found in target class' });
      }
    }

    const nextOrderIndex = Number.isInteger(orderIndex)
      ? orderIndex
      : await getNextOrderIndex({ classId: targetClassId, userId, parentId: nextParentId });

    await folder.update({
      classId: targetClassId,
      parentId: nextParentId,
      orderIndex: nextOrderIndex
    });

    res.status(200).json(folder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteFolder = async (req, res) => {
  try {
    const folder = req.folder;
    const userId = req.user.id;

    const childFolders = await Folder.findAll({
      where: { parentId: folder.id, userId }
    });
    const childFolderIds = childFolders.map(f => f.id);

    await Lesson.destroy({
      where: {
        userId,
        folderId: {
          [Op.in]: [folder.id, ...childFolderIds]
        }
      }
    });

    if (childFolderIds.length) {
      await Folder.destroy({ where: { id: { [Op.in]: childFolderIds }, userId } });
    }

    await folder.destroy();

    res.status(200).json({ message: 'Folder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createFolder,
  getFolders,
  getFolderById,
  updateFolder,
  reorderFolder,
  moveFolder,
  deleteFolder
};
