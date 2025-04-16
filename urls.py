from django.urls import path
from . import views

urlpatterns = [
    path('api/chatbot/', views.ChatbotAPIView.as_view(), name='chatbot-api'),
]
