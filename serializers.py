from rest_framework import serializers

class ChatbotResponseSerializer(serializers.Serializer):
    topic = serializers.CharField()
    skill_level = serializers.CharField()
    response_text = serializers.CharField()
