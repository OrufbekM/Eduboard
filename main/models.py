from django.db import models
from django.core.validators import EmailValidator, RegexValidator


class Teacher(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(
        max_length=100,
        unique=True,
        validators=[
            EmailValidator(
                message='Iltimos, to‘g‘ri email manzilini kiriting (masalan: example@gmail.com).'
            )
        ]
    )
    phone_number = models.CharField(
        max_length=15,
        validators=[
            RegexValidator(
                regex=r'^\+?\d{9,15}$',
                message='Telefon raqami faqat raqam bo‘lishi kerak (masalan: +998901234567).'
            )
        ]
    )
    password = models.CharField(max_length=128)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"


class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Type(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="types"
    )
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.category} - {self.name}"


class Lesson(models.Model):
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        related_name="lessons"
    )
    type = models.ForeignKey(
        Type,
        on_delete=models.CASCADE,
        related_name="lessons"
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class RoadmapItem(models.Model):
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name="roadmap"
    )
    title = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.lesson.name}  {self.title}"