from django.shortcuts import render
from . import models

# Create your views here.

def chat_view(request):
    messages = models.Message.objects.all()
    return render(request, 'index.html', {'messages': messages})
