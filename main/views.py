from django.shortcuts import render, redirect
from .models import Lesson, Teacher
from .form import LessonForm
from .services import ask_ai
from django.contrib import messages
from django.utils import timezone


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

from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Teacher

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
    
    return render(request, 'index.html')

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
