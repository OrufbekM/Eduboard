const { Class, ClassCategory } = require('../models');

const createClass = async (req, res) => {
  try {
    const { name, description, categoryId } = req.body;
    
    const newClass = await Class.create({
      name,
      description,
      categoryId
    });

    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: [{
        model: ClassCategory,
        as: 'category'
      }]
    });
    
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const classWithCategory = await Class.findByPk(id, {
      include: [{
        model: ClassCategory,
        as: 'category'
      }]
    });

    if (!classWithCategory) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.status(200).json(classWithCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateClass = async (req, res) => {
  try {
    const classItem = req.classItem;
    const { name, description, categoryId } = req.body;

    await classItem.update({
      name,
      description,
      categoryId
    });

    res.status(200).json(classItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteClass = async (req, res) => {
  try {
    const classItem = req.classItem;

    await classItem.destroy();

    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass
};
