from channels.generic.websocket import WebsocketConsumer
import json
import random
from asgiref.sync import async_to_sync
from .models import Message

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.username = self.generate_random_username()
        self.group_name = 'public_chat'
        
        # Add the user to the chat group
        async_to_sync(self.channel_layer.group_add)(
            self.group_name,
            self.channel_name
        )
        
        self.accept()
        
        # Notify others that a new user has joined
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                'type': 'chat_message',
                'username': 'System',
                'message': f'{self.username} has joined the chat',
            }
        )
        
    def disconnect(self, close_code):
        # Notify others that a user has left
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                'type': 'chat_message',
                'username': 'System',
                'message': f'{self.username} has left the chat',
            }
        )
        
        # Remove the user from the chat group
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )
        
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        
        # Create a new chat message
        Message.objects.create(
            username=self.username,
            content=message
        )
        
        # Send message to the group
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                'type': 'chat_message',
                'username': self.username,
                'message': message,
            }
        )
        
    def chat_message(self, event):
        username = event['username']
        message = event['message']
        
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'username': username,
            'message': message
        }))
        
    def generate_random_username(self):
        adjectives = ['Cool', 'Super', 'Happy', 'Funny', 'Smart']
        nouns = ['Cat', 'Dog', 'Lion', 'Tiger', 'Bear']
        return f'{random.choice(adjectives)} {random.choice(nouns)}'