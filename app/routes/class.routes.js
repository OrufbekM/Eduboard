const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { checkClassExists, validateClassData } = require('../middleware/class.middleware');
const { createClass, getAllClasses, getClassById, updateClass, deleteClass } = require('../controllers/class.controller');

router.post("/create", authMiddleware, validateClassData, createClass);
router.get("/", authMiddleware, getAllClasses);
router.get("/:id", authMiddleware, checkClassExists, getClassById);
router.put("/:id/update", authMiddleware, checkClassExists, validateClassData, updateClass);
router.delete("/:id/delete", authMiddleware, checkClassExists, deleteClass);

module.exports = router;
