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

class LinguisticLesson(models.Model):
    LANG_CHOICES = [
        ("EN", "English"),
        ("RU", "Russian"),
    ]

    teacher = models.ForeignKey(
        Teacher, on_delete=models.CASCADE,
        related_name="linguistic_lessons"
    )
    language = models.CharField(max_length=2, choices=LANG_CHOICES)

    def __str__(self):
        return f"{self.get_language_display()} - {self.teacher.username}"


class SubjectLesson(models.Model):
    SUBJECT_CHOICES = [
        ("SAT", "SAT"),
    ]

    teacher = models.ForeignKey(
        Teacher, on_delete=models.CASCADE,
        related_name="subject_lessons"
    )
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES)

    def __str__(self):
        return f"{self.get_subject_display()} - {self.teacher.username}"


class Group(models.Model):
    name = models.CharField(max_length=50)
    linguistic_lesson = models.ForeignKey(
        LinguisticLesson,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="groups"
    )
    subject_lesson = models.ForeignKey(
        SubjectLesson,
        null=True, blank=True,
        on_delete=models.SET_NULL, 
        related_name="groups"
    )

    def __str__(self):
        lessons = []
        if self.linguistic_lesson:
            lessons.append(str(self.linguistic_lesson))
        if self.subject_lesson:
            lessons.append(str(self.subject_lesson))
        lesson_str = " + ".join(lessons) if lessons else "No lessons"
        return f"{self.name} ({lesson_str})"


class Lesson(models.Model):
    name = models.CharField(max_length=50)
    group = models.ForeignKey(
        Group, on_delete=models.CASCADE,
        related_name="lessons" 
    )

    def __str__(self):
        return f"{self.name} → {self.group.name}"