from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_view, name='login'),         
    path('home/', views.home_view, name='home'),       
    path('logout/', views.logout_view, name='logout'), 
    path('add-group/', views.add_group_view, name='add_group'),
    path('get-lessons/', views.get_lessons_view, name='get_lessons'),
    path('add-class-form/', views.show_add_form_view, name='add_class_form'),
    path('class/<int:class_id>/', views.class_detail_view, name='class_detail'),
    path('public-lessons/', views.public_lessons_view, name='public_lessons'),
]