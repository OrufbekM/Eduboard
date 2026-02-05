const express = require("express");
const cors = require("cors");
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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/class-category', classCategoryRoutes);
app.use('/api/class', classRoutes);
app.use('/api/lesson', lessonRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to EduNova API' });
});

const PORT = process.env.PORT || 3000;

const shouldAlter = process.env.DB_SYNC_ALTER === 'true';

db.sequelize.sync({ alter: shouldAlter }).then(() => {
  console.log('Database synchronized successfully');
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error('Unable to sync database:', error);
});
