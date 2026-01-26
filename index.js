const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require('dotenv').config();

const authRoutes = require('./app/routes/auth.routes');
const classCategoryRoutes = require('./app/routes/classCategory.routes');
const classRoutes = require('./app/routes/class.routes');
const lessonRoutes = require('./app/routes/lesson.routes');
const db = require('./app/models');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/class-category', classCategoryRoutes);
app.use('/api/class', classRoutes);
app.use('/api/lesson', lessonRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to EduBoard API' });
});

const PORT = process.env.PORT || 3000;

db.sequelize.sync({ alter: false }).then(() => {
  console.log('Database synchronized successfully');
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error('Unable to sync database:', error);
});
