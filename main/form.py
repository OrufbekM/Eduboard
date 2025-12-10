from django import forms
from .models import Lesson

class LessonForm(forms.ModelForm):
    class Meta:
        model = Lesson
        fields = ['name']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Dars nomi'}),
        }
