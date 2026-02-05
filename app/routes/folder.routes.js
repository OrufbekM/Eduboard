const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { validateFolderData, checkFolderExists } = require('../middleware/folder.middleware');
const {
  createFolder,
  getFolders,
  getFolderById,
  updateFolder,
  reorderFolder,
  moveFolder,
  deleteFolder
} = require('../controllers/folder.controller');

router.post('/create', authMiddleware, validateFolderData, createFolder);
router.get('/', authMiddleware, getFolders);
router.get('/:id', authMiddleware, checkFolderExists, getFolderById);
router.put('/:id/update', authMiddleware, checkFolderExists, updateFolder);
router.put('/:id/reorder', authMiddleware, checkFolderExists, reorderFolder);
router.put('/:id/move', authMiddleware, checkFolderExists, moveFolder);
router.delete('/:id/delete', authMiddleware, checkFolderExists, deleteFolder);

module.exports = router;
