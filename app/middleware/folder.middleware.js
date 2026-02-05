const { Folder, Class } = require('../models');

const validateFolderData = async (req, res, next) => {
  try {
    const { name, classId, parentId } = req.body || {};
    const userId = req.user.id;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (!classId || isNaN(classId)) {
      return res.status(400).json({ message: 'Class ID is required and must be a number' });
    }

    const classItem = await Class.findOne({ where: { id: classId, userId } });
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    if (parentId !== undefined && parentId !== null && parentId !== '') {
      if (isNaN(parentId)) {
        return res.status(400).json({ message: 'Parent ID must be a number' });
      }
      const parentFolder = await Folder.findOne({ where: { id: parentId, userId, classId } });
      if (!parentFolder) {
        return res.status(400).json({ message: 'Parent folder not found in this class' });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkFolderExists = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const folder = await Folder.findOne({ where: { id, userId } });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    req.folder = folder;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  validateFolderData,
  checkFolderExists
};
