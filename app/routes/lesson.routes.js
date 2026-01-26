const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { checkLessonExists, validateLessonData } = require('../middleware/lesson.middleware');
const { createLesson, getAllLessons, getLessonById, updateLesson, deleteLesson } = require('../controllers/lesson.controller');

router.post("/create", authMiddleware, validateLessonData, createLesson);
router.get("/", authMiddleware, getAllLessons);
router.get("/:id", authMiddleware, checkLessonExists, getLessonById);
router.put("/:id/update", authMiddleware, checkLessonExists, validateLessonData, updateLesson);
router.delete("/:id/delete", authMiddleware, checkLessonExists, deleteLesson);

module.exports = router;
