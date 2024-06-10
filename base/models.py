from django.db import models

# Create your models here.

class Message(models.Model):
    username = models.CharField(max_length=64, default='dude')
    content = models.TextField(null=False)
    created = models.DateTimeField(auto_now_add=True)
    
    def __str__(self) -> str:
        return f'Username: {self.username}, Content: {self.content}, Date: {self.created}'