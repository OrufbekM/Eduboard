const { Lesson, Class } = require('../models');
const path = require('path');

const toPublicPath = (absolutePath) => {
  if (!absolutePath) return null;
  const relative = path.relative(path.join(__dirname, '..', '..'), absolutePath);
  return relative.replace(/\\/g, '/');
};

const createLesson = async (req, res) => {
  try {
    const { name, classId, text } = req.body || {};
    const userId = req.user.id;
    const imagePath = req.files && req.files.image ? toPublicPath(req.files.image[0].path) : null;
    const videoPath = req.files && req.files.video ? toPublicPath(req.files.video[0].path) : null;
    
    const newLesson = await Lesson.create({
      name,
      classId,
      userId,
      image: imagePath,
      video: videoPath,
      text: text || null
    });

    res.status(201).json(newLesson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllLessons = async (req, res) => {
  try {
    const userId = req.user.id;
    const lessons = await Lesson.findAll({
      where: { userId },
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
    const userId = req.user.id;
    
    const lessonWithClass = await Lesson.findOne({
      where: { id, userId },
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
    const { name, classId, text } = req.body || {};
    const imagePath = req.files && req.files.image ? toPublicPath(req.files.image[0].path) : undefined;
    const videoPath = req.files && req.files.video ? toPublicPath(req.files.video[0].path) : undefined;

    const updatePayload = {
      name,
      classId,
      text: text ?? lesson.text,
    };
    if (imagePath !== undefined) updatePayload.image = imagePath;
    if (videoPath !== undefined) updatePayload.video = videoPath;

    await lesson.update(updatePayload);

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
