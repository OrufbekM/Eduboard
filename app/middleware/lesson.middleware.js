const { Lesson, Class, Folder } = require('../models');

const checkLessonExists = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findByPk(id);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    req.lesson = lesson;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const validateLessonData = async (req, res, next) => {
  try {
    const { name, classId, folderId } = req.body || {};
    const userId = req.user.id;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    if (!classId || isNaN(classId)) {
      return res.status(400).json({ message: 'Class ID is required and must be a number' });
    }
    
    const classExists = await Class.findByPk(classId);
    if (!classExists) {
      return res.status(400).json({ message: 'Class not found' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkLessonAccess = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const lesson = await Lesson.findOne({ where: { id, userId } });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    req.lesson = lesson;
    if (folderId !== undefined && folderId !== null && folderId !== '') {
      if (isNaN(folderId)) {
        return res.status(400).json({ message: 'Folder ID must be a number' });
      }

      const folder = await Folder.findOne({ where: { id: folderId, classId, userId } });
      if (!folder) {
        return res.status(400).json({ message: 'Folder not found for this class' });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  checkLessonExists,
  checkLessonAccess,
  validateLessonData
};
