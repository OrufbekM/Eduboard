from django.contrib import admin
from django.contrib.auth.hashers import make_password
from .models import Teacher, LinguisticLesson, SubjectLesson, Group, Lesson


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'get_full_name', 'phone_number')
    list_filter = ('first_name', 'last_name')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone_number')
    ordering = ('last_name', 'first_name')
    
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('username', 'email', 'first_name', 'last_name', 'phone_number')
        }),
        ('Parol', {
            'fields': ('password',),
            'description': 'Parolni kiriting. Agar o\'zgartirmoqchi bo\'lsangiz, yangi parolni kiriting.'
        }),
    )


class GroupInline(admin.TabularInline):
    model = Group
    extra = 0
    fields = ('name',)
    show_change_link = True


@admin.register(LinguisticLesson)
class LinguisticLessonAdmin(admin.ModelAdmin):
    list_display = ('get_teacher_full_name', 'language', 'teacher_username')
    list_filter = ('language', 'teacher')
    search_fields = ('teacher__username', 'teacher__first_name', 'teacher__last_name')
    ordering = ('language', 'teacher__last_name')
    inlines = [GroupInline]
    
    def get_teacher_full_name(self, obj):
        return f"{obj.teacher.first_name} {obj.teacher.last_name}"
    get_teacher_full_name.short_description = 'O\'qituvchi'
    
    def teacher_username(self, obj):
        return obj.teacher.username
    teacher_username.short_description = 'Username'


@admin.register(SubjectLesson)
class SubjectLessonAdmin(admin.ModelAdmin):
    list_display = ('get_teacher_full_name', 'subject', 'teacher_username')
    list_filter = ('subject', 'teacher')
    search_fields = ('teacher__username', 'teacher__first_name', 'teacher__last_name')
    ordering = ('subject', 'teacher__last_name')
    inlines = [GroupInline]
    
    def get_teacher_full_name(self, obj):
        return f"{obj.teacher.first_name} {obj.teacher.last_name}"
    get_teacher_full_name.short_description = 'O\'qituvchi'
    
    def teacher_username(self, obj):
        return obj.teacher.username
    teacher_username.short_description = 'Username'


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1
    fields = ('name',)
    ordering = ('name',)


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'linguistic_lesson_display', 'subject_lesson_display', 'lessons_count')
    list_filter = ('linguistic_lesson__language', 'subject_lesson__subject', 'linguistic_lesson', 'subject_lesson')
    search_fields = ('name',)
    ordering = ('name',)
    inlines = [LessonInline]
    
    def linguistic_lesson_display(self, obj):
        if obj.linguistic_lesson:
            return f"{obj.linguistic_lesson.get_language_display()} ({obj.linguistic_lesson.teacher.username})"
        return "Yo'q"
    linguistic_lesson_display.short_description = 'Til darsi'
    
    def subject_lesson_display(self, obj):
        if obj.subject_lesson:
            return f"{obj.subject_lesson.get_subject_display()} ({obj.subject_lesson.teacher.username})"
        return "Yo'q"
    subject_lesson_display.short_description = 'Fan darsi'
    
    def lessons_count(self, obj):
        return obj.lessons.count()
    lessons_count.short_description = 'Darslar soni'


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('name', 'group_name', 'group_linguistic_lesson', 'group_subject_lesson')
    list_filter = ('group__linguistic_lesson', 'group__subject_lesson', 'group')
    search_fields = ('name', 'group__name')
    ordering = ('group__name', 'name')
    
    def group_name(self, obj):
        return obj.group.name
    group_name.short_description = 'Guruh'
    
    def group_linguistic_lesson(self, obj):
        if obj.group.linguistic_lesson:
            return obj.group.linguistic_lesson.get_language_display()
        return "Yo'q"
    group_linguistic_lesson.short_description = 'Til darsi'
    
    def group_subject_lesson(self, obj):
        if obj.group.subject_lesson:
            return obj.group.subject_lesson.get_subject_display()
        return "Yo'q"
    group_subject_lesson.short_description = 'Fan darsi'
