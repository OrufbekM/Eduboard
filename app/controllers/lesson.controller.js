const { Lesson, Class } = require('../models');

const createLesson = async (req, res) => {
  try {
    const { name, classId } = req.body;
    
    const newLesson = await Lesson.create({
      name,
      classId
    });

    res.status(201).json(newLesson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.findAll({
      include: [{
        model: Class,
        as: 'class'
      }]
    });
    
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const lessonWithClass = await Lesson.findByPk(id, {
      include: [{
        model: Class,
        as: 'class'
      }]
    });

    if (!lessonWithClass) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.status(200).json(lessonWithClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLesson = async (req, res) => {
  try {
    const lesson = req.lesson;
    const { name, classId } = req.body;

    await lesson.update({
      name,
      classId
    });

    res.status(200).json(lesson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const lesson = req.lesson;

    await lesson.destroy();

    res.status(200).json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLesson,
  getAllLessons,
  getLessonById,
  updateLesson,
  deleteLesson
};
