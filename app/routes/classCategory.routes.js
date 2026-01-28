const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
 
const {
  createClassCategory,
  getAllClassCategories,
  getClassCategoryById,
  updateClassCategory,
  deleteClassCategory,
} = require("../controllers/classCategory.controller");

const {
  validateCreateClassCategory,
  validateUpdateClassCategory,
  validateClassCategoryId,
} = require("../middleware/classCategory.middleware");

router.post("/create", authMiddleware, validateCreateClassCategory, createClassCategory);
router.get("/", authMiddleware, getAllClassCategories);
router.get("/:id", authMiddleware, validateClassCategoryId, getClassCategoryById);
router.put("/:id/update", authMiddleware, validateUpdateClassCategory, updateClassCategory);
router.delete("/:id/delete", authMiddleware, validateClassCategoryId, deleteClassCategory);

module.exports = router;
