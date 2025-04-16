from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ChatbotResponseSerializer
from g4f.client import Client

class ChatbotAPIView(APIView):
    def post(self, request):
        # Extract the data from the request
        topic = request.data.get('topic')
        skill_level = request.data.get('skill_level')
        feedback = request.data.get('feedback')  # Get feedback if any

        # Initialize the client for the chatbot API
        client = Client()

        # If there's feedback, respond accordingly
        if feedback:
            if feedback.lower() == 'yes':
                response_text = "Thank you for the positive feedback!"
            elif feedback.lower() == 'no':
                response_text = "Sorry for the confusion! I'll try to help you better next time."
            else:
                response_text = "I didn't understand your feedback. Please respond with 'Yes' or 'No'."
        else:
            # Generate the chatbot response if no feedback is provided
            prompt = f"Topic: {topic}\nSkill Level: {skill_level}\nProvide information about {topic} suitable for {skill_level} level."
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
            )
            response_text = response.choices[0].message.content
            feedback_prompt = "Was this answer helpful? (Yes/No)"  # Feedback prompt to be sent with the response

            # Return the response and the feedback prompt
            return Response({
                'topic': topic,
                'skill_level': skill_level,
                'response_text': response_text,
                'feedback_prompt': feedback_prompt,
            }, status=status.HTTP_200_OK)

        # If feedback was provided, return only the response
        return Response({
            'response_text': response_text,
        }, status=status.HTTP_200_OK)
