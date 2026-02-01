const { Lesson, Class } = require('../models');

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
    const { name, classId } = req.body || {};
    
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

module.exports = {
  checkLessonExists,
  validateLessonData
};
