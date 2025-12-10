from django.contrib import admin
from django.contrib.auth.hashers import make_password
from .models import Teacher, Category, Type, Lesson, RoadmapItem


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

admin.site.register(Category)
admin.site.register(Type)
admin.site.register(Lesson)
admin.site.register(RoadmapItem)

