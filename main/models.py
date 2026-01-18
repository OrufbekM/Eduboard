from django.db import models
from django.core.validators import EmailValidator, RegexValidator


class Organization(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Branch(models.Model):
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="branches",
    )
    name = models.CharField(max_length=255)

    class Meta:
        unique_together = ("organization", "name")

    def __str__(self):
        return f"{self.organization.name} – {self.name}"


class User(models.Model):
    ROLE_PUBLIC_USER = "PUBLIC_USER"
    ROLE_TEACHER = "TEACHER"
    ROLE_MANAGER = "MANAGER"
    ROLE_MAIN_MANAGER = "MAIN_MANAGER"

    ROLE_CHOICES = (
        (ROLE_PUBLIC_USER, "Public User"),
        (ROLE_TEACHER, "Teacher"),
        (ROLE_MANAGER, "Manager"),
        (ROLE_MAIN_MANAGER, "Main Manager"),
    )

    STATUS_PENDING = "PENDING"
    STATUS_ACTIVE = "ACTIVE"
    STATUS_SUSPENDED = "SUSPENDED"

    STATUS_CHOICES = (
        (STATUS_PENDING, "Pending"),
        (STATUS_ACTIVE, "Active"),
        (STATUS_SUSPENDED, "Suspended"),
    )

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
        blank=True,
        null=True,
        validators=[
            RegexValidator(
                regex=r'^\+?\d{9,15}$',
                message='Telefon raqami faqat raqam bo‘lishi kerak (masalan: +998901234567).'
            )
        ]
    )
    password = models.CharField(max_length=128)

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=ROLE_PUBLIC_USER,
        help_text="User role: PUBLIC_USER (default), TEACHER, MANAGER, or MAIN_MANAGER.",
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
        help_text="Account lifecycle status: PENDING (default), ACTIVE, or SUSPENDED.",
    )

    organization = models.ForeignKey(
        Organization,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users",
        help_text="Organization assignment (null for PUBLIC_USER and independent teachers).",
    )
    branch = models.ForeignKey(
        Branch,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users",
        help_text="Branch assignment (null for PUBLIC_USER, MAIN_MANAGER, and independent teachers).",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ['-created_at']


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


class Class(models.Model):
    teacherOfClass = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="classes",
        help_text="The teacher who owns/manages this class (name and id).",
    )
    type = models.ForeignKey(
        Type,
        on_delete=models.CASCADE,
        related_name="classes",
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    organization = models.ForeignKey(
        Organization,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="classes",
        help_text="Organization this class belongs to (null for independent teachers).",
    )
    branch = models.ForeignKey(
        Branch,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="classes",
        help_text="Branch this class belongs to (null for independent teachers).",
    )

    def __str__(self):
        return f"{self.name} ({self.type})"

    @property
    def teacher_name(self):
        return self.teacherOfClass.get_full_name()

    @property
    def teacher_id(self):
        return self.teacherOfClass.id


class Lesson(models.Model):
    PRIVACY_PRIVATE = "PRIVATE"
    PRIVACY_ORG = "ORG"
    PRIVACY_PUBLIC = "PUBLIC"

    PRIVACY_CHOICES = (
        (PRIVACY_PRIVATE, "Private"),
        (PRIVACY_ORG, "Organization"),
        (PRIVACY_PUBLIC, "Public"),
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="created_lessons",
        help_text="The teacher/user who created this lesson (teacher and id).",
    )
    related_class = models.ForeignKey(
        Class,
        on_delete=models.CASCADE,
        related_name="lessons",
        help_text="The class this lesson belongs to (class name and id).",
    )
    type = models.ForeignKey(
        Type,
        on_delete=models.CASCADE,
        related_name="lessons"
    )
    
    title = models.CharField(max_length=200, help_text="Lesson title/name.")
    name = models.CharField(max_length=200, blank=True, help_text="Alias for title (for backward compatibility).")

    privacy = models.CharField(
        max_length=10,
        choices=PRIVACY_CHOICES,
        default=PRIVACY_PRIVATE,
        help_text="Privacy level: PRIVATE (default), ORG (organization), or PUBLIC.",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    organization = models.ForeignKey(
        Organization,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="lessons",
        help_text="Organization this lesson belongs to (ORG and id, if applicable).",
    )

    def __str__(self):
        return self.title or self.name

    def save(self, *args, **kwargs):
        if not self.name and self.title:
            self.name = self.title
        if not self.organization and self.related_class and self.related_class.organization:
            self.organization = self.related_class.organization
        super().save(*args, **kwargs)

    @property
    def teacher_name(self):
        return self.created_by.get_full_name()

    @property
    def teacher_id(self):
        return self.created_by.id

    @property
    def class_name(self):
        return self.related_class.name

    @property
    def class_id(self):
        return self.related_class.id


class RoadmapItem(models.Model):
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name="roadmap"
    )
    title = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.lesson.name}  {self.title}"


class LessonBlock(models.Model):
    BLOCK_TEXT = "text"
    BLOCK_VIDEO = "video"
    BLOCK_QUIZ = "quiz"
    BLOCK_ASSIGNMENT = "assignment"

    BLOCK_TYPE_CHOICES = (
        (BLOCK_TEXT, "Text"),
        (BLOCK_VIDEO, "Video"),
        (BLOCK_QUIZ, "Quiz"),
        (BLOCK_ASSIGNMENT, "Assignment"),
    )

    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name="blocks",
    )
    block_type = models.CharField(
        max_length=20,
        choices=BLOCK_TYPE_CHOICES,
    )
    content = models.JSONField(
        help_text="Arbitrary JSON describing the block payload (text, quiz config, video URL, etc.).",
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Ordering of blocks inside a lesson.",
    )

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.lesson.name} – {self.block_type} #{self.order}"