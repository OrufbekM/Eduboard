from django.shortcuts import render, redirect, get_object_or_404
from .models import Teacher, Category, Type, Lesson, RoadmapItem, Class

from .form import LessonForm
from .services import ask_ai
from django.contrib import messages
from django.utils import timezone
from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# def create_lesson(request):
#     if request.method == "POST":
#         form = LessonForm(request.POST)
#         if form.is_valid():
#             lesson = form.save(commit=False)

#             prompt = f"Yangi dars mavzusi: {lesson.name}. Batafsil tushuntiring."
#             lesson.content = ask_ai(prompt) 

#             lesson.save()
#             return redirect("lesson_list")
#     else:
#         form = LessonForm()

#     return render(request, "create_lesson.html", {"form": form})

# def home_view(request):
#     return render(request, 'main/index.html')


@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        try:
            teacher = Teacher.objects.get(email=email)
            if hasattr(teacher, 'check_password'):
                if teacher.check_password(password):
                    request.session['teacher_id'] = teacher.id
                    request.session['teacher_name'] = f"{teacher.first_name} {teacher.last_name}"
                    return redirect('home') 
                else:
                    messages.error(request, 'Invalid password')
            else:
                if teacher.password == password:
                    request.session['teacher_id'] = teacher.id
                    request.session['teacher_name'] = f"{teacher.first_name} {teacher.last_name}"
                    return redirect('home')
                else:
                    messages.error(request, 'Invalid password')
                    
        except Teacher.DoesNotExist:
            messages.error(request, 'Email not found')
    
    return render(request, 'login.html')

def home_view(request):
    if not request.session.get('teacher_id'):
        return redirect('login')
    teacher_id = request.session.get('teacher_id')
    if not teacher_id:
        messages.error(request, 'Please login first')
        return redirect('login')
    
    try:
        teacher = Teacher.objects.get(id=teacher_id)
    except Teacher.DoesNotExist:
        messages.error(request, 'Teacher not found')
        return redirect('login')

    linguistic_category = Category.objects.filter(name__iexact='Linguistic').first()
    subject_category = Category.objects.filter(name__iexact='Subject').first()

    if linguistic_category:
        linguistic_classes = Class.objects.filter(
            teacher=teacher,
            type__category=linguistic_category
        ).select_related('type', 'type__category')
    else:
        linguistic_classes = Class.objects.none()

    if subject_category:
        subject_classes = Class.objects.filter(
            teacher=teacher,
            type__category=subject_category
        ).select_related('type', 'type__category')
    else:
        subject_classes = Class.objects.none()

    categories = Category.objects.all()
    types = Type.objects.select_related('category').all()

    current_time = timezone.now()

    context = {
        'teacher': teacher,
        'linguistic_category': linguistic_category,
        'subject_category': subject_category,
        'linguistic_classes': linguistic_classes,
        'subject_classes': subject_classes,
        'categories': categories,
        'types': types,
        'current_time': current_time,
        'title': 'Dashboard - Edu Board',
    }
        
    return render(request, 'index.html', context)

def logout_view(request):
    request.session.flush()
    return redirect('login')

# def register_view(request):
#     if request.session.get('teacher_id'):
#         return redirect('dashboard')
    
#     if request.method == 'POST':
#         first_name = request.POST.get('first_name')
#         last_name = request.POST.get('last_name')
#         email = request.POST.get('email')
#         phone_number = request.POST.get('phone_number')
#         password = request.POST.get('password')
#         confirm_password = request.POST.get('confirm_password')
        
#         errors = []
        
#         if password != confirm_password:
#             errors.append('Parollar mos kelmadi')
        
#         if Teacher.objects.filter(email=email).exists():
#             errors.append('Bu email allaqachon ro\'yxatdan o\'tgan')
        
#         if Teacher.objects.filter(phone_number=phone_number).exists():
#             errors.append('Bu telefon raqam allaqachon band')
        
#         if errors:
#             for error in errors:
#                 messages.error(request, error)
#             return render(request, 'main/register.html', {
#                 'first_name': first_name,
#                 'last_name': last_name,
#                 'email': email,
#                 'phone_number': phone_number,
#             })
#         else:
#             username = email.split('@')[0]
            
#             teacher = Teacher.objects.create(
#                 first_name=first_name,
#                 last_name=last_name,
#                 email=email,
#                 username=username,
#                 phone_number=phone_number,
#             )
            
#             teacher.set_password(password)
            
#             messages.success(request, 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz! Endi login qiling.')
#             return redirect('login')
    
#     return render(request, 'main/register.html')


@csrf_exempt
def add_group_view(request):
    
    if not request.session.get('teacher_id'):
        return JsonResponse({
            'success': False, 
            'error': 'Please login first'
        })
    
    if request.method == 'POST':
        try:
            teacher_id = request.session['teacher_id']
            teacher = Teacher.objects.get(id=teacher_id)
            
            name = request.POST.get('name', '').strip()
            description = request.POST.get('description', '').strip()
            category_id = request.POST.get('category_id', '').strip()
            type_id = request.POST.get('type_id', '').strip()
            
            if not name:
                return JsonResponse({
                    'success': False, 
                    'error': 'Class name is required'
                })
            
            if not category_id or not type_id:
                return JsonResponse({
                    'success': False, 
                    'error': 'Please select a category and type'
                })
            try:
                category = Category.objects.get(id=int(category_id))
            except (Category.DoesNotExist, ValueError):
                return JsonResponse({
                    'success': False,
                    'error': 'Selected category is invalid'
                })

            try:
                class_type = Type.objects.get(id=int(type_id), category=category)
            except (Type.DoesNotExist, ValueError):
                return JsonResponse({
                    'success': False,
                    'error': 'Selected type is invalid for this category'
                })

            class_obj = Class.objects.create(
                teacher=teacher,
                type=class_type,
                name=name,
                description=description,
            )

            return JsonResponse({
                'success': True,
                'message': f'Class "{name}" created successfully!',
                'class_id': class_obj.id,
                'class_name': class_obj.name,
                'type_name': class_obj.type.name,
                'category_name': class_obj.type.category.name,
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False, 
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False, 
        'error': 'Invalid request method'
    })


def class_detail_view(request, class_id):
    """Displays a single class dashboard and allows creating lessons inside it."""
    if not request.session.get('teacher_id'):
        return redirect('login')

    teacher_id = request.session['teacher_id']
    class_obj = get_object_or_404(Class.objects.select_related('type', 'teacher'), id=class_id, teacher_id=teacher_id)

    if request.method == 'POST':
        lesson_name = request.POST.get('lesson_name', '').strip()
        if not lesson_name:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'error': 'Lesson name is required'})
            messages.error(request, 'Lesson name is required')
        else:
            lesson = Lesson.objects.create(
                teacher=class_obj.teacher,
                type=class_obj.type,
                related_class=class_obj,
                name=lesson_name,
            )
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'lesson_id': lesson.id,
                    'lesson_name': lesson.name,
                })
            # Non-AJAX: just redirect quietly, no success message
            return redirect('class_detail', class_id=class_obj.id)

    lessons = class_obj.lessons.all().order_by('id')

    context = {
        'class_obj': class_obj,
        'lessons': lessons,
    }
    return render(request, 'lessondash.html', context)

def get_lessons_view(request):
    """AJAX uchun lesson turlari va kategoriyalar ro'yxatini qaytarish"""
    
    if not request.session.get('teacher_id'):
        return JsonResponse({'lessons': []})
    
    try:
        types = Type.objects.select_related('category').all()
        
        lessons_data = []
        for lesson_type in types:
            lessons_data.append({
                'id': lesson_type.id,
                'category_id': lesson_type.category_id,
                'category_name': lesson_type.category.name,
                'type_name': lesson_type.name,
            })
        
        return JsonResponse({
            'success': True,
            'lessons': lessons_data
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        })

def show_add_form_view(request):
    """Add form sahifasini ko'rsatish (agar alohida sahifa kerak bo'lsa)"""
    
    if not request.session.get('teacher_id'):
        return redirect('login')
    
    return home_view(request)