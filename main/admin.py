from django.contrib import admin
from django.contrib.auth.hashers import make_password
from .models import User, Category, Type, Lesson, RoadmapItem, Organization, Branch, Class, LessonBlock


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'get_full_name', 'role', 'status', 'organization', 'branch')
    list_filter = ('role', 'status', 'organization', 'branch', 'created_at')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone_number')
    ordering = ('-created_at', 'last_name', 'first_name')
    
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('username', 'email', 'first_name', 'last_name', 'phone_number')
        }),
        ('Rol va Status', {
            'fields': ('role', 'status'),
            'description': 'Yangi foydalanuvchilar default: PUBLIC_USER role, PENDING status. Admin qo\'lda o\'zgartirishi kerak.'
        }),
        ('Tashkilot va Filial', {
            'fields': ('organization', 'branch'),
            'description': 'PUBLIC_USER va mustaqil o\'qituvchilar uchun null bo\'lishi mumkin.'
        }),
        ('Parol', {
            'fields': ('password',),
            'description': 'Parolni kiriting. Agar o\'zgartirmoqchi bo\'lsangiz, yangi parolni kiriting.'
        }),
    )

    def save_model(self, request, obj, form, change):
        # Hash password if it's being set/changed
        if 'password' in form.changed_data or not change:
            obj.password = make_password(obj.password)
        super().save_model(request, obj, form, change)


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ('name', 'organization')
    list_filter = ('organization',)
    search_fields = ('name', 'organization__name')


@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ('name', 'teacherOfClass', 'type', 'organization', 'branch')
    list_filter = ('type', 'organization', 'branch', 'created_at')
    search_fields = ('name', 'teacherOfClass__email', 'teacherOfClass__first_name', 'teacherOfClass__last_name')


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by', 'related_class', 'privacy', 'organization', 'created_at')
    list_filter = ('privacy', 'organization', 'created_at', 'type')
    search_fields = ('title', 'name', 'created_by__email', 'related_class__name')


@admin.register(LessonBlock)
class LessonBlockAdmin(admin.ModelAdmin):
    list_display = ('lesson', 'block_type', 'order')
    list_filter = ('block_type',)
    search_fields = ('lesson__title', 'lesson__name')


admin.site.register(Category)
admin.site.register(Type)
admin.site.register(RoadmapItem)

