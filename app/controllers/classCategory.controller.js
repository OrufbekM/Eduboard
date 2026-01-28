const { ClassCategory } = require("../models");

module.exports.createClassCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await ClassCategory.create({
      name,
    });

    return res.status(201).json({
      message: "Class category created successfully",
      data: category,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};


module.exports.updateClassCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await ClassCategory.findByPk(id);

    if (!category) {
      return res.status(404).json({
        message: "Class category not found",
      });
    }

    await category.update({ name });

    return res.status(200).json({
      message: "Class category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports.getAllClassCategories = async (req, res) => {
  try {
    const categories = await ClassCategory.findAll();

    return res.status(200).json({
      message: "Class categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports.getClassCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ClassCategory.findByPk(id);

    if (!category) {
      return res.status(404).json({
        message: "Class category not found",
      });
    }

    return res.status(200).json({
      message: "Class category retrieved successfully",
      data: category,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports.deleteClassCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await ClassCategory.findByPk(id);

    if (!category) {
      return res.status(404).json({
        message: "Class category not found",
      });
    }

    await category.destroy();

    return res.status(200).json({
      message: "Class category deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};