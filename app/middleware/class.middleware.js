const { Class } = require('../models');

const checkClassExists = async (req, res, next) => {
  try {
    const { id } = req.params;
    const classItem = await Class.findByPk(id);
    
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    req.classItem = classItem;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const validateClassData = (req, res, next) => {
  try {
    const { name, description, categoryId } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    if (categoryId && isNaN(categoryId)) {
      return res.status(400).json({ message: 'Category ID must be a number' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  checkClassExists,
  validateClassData
};
