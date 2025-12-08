from django import forms
from .models import Lesson, Group

class LessonForm(forms.ModelForm):
    class Meta:
        model = Lesson
        fields = ['name', 'group']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Dars nomi'}),
            'group': forms.Select(attrs={'class': 'form-control'}),
        }
