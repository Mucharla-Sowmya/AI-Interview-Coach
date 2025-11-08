from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from openai import OpenAI
from .models import Question, Answer, UserSession
from .serializers import QuestionSerializer, AnswerSerializer, UserSessionSerializer
import os
from dotenv import load_dotenv
import re

# ===================================================
# 🔹 Setup
# ===================================================
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# ===================================================
# 🔹 CRUD API ViewSets
# ===================================================
class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer


class UserSessionViewSet(viewsets.ModelViewSet):
    queryset = UserSession.objects.all()
    serializer_class = UserSessionSerializer


# ===================================================
# 🔹 Step 1: Generate AI-based interview question
# ===================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_question(request):
    role = request.data.get("role", "Software Developer")

    try:
        user = request.user
        session, _ = UserSession.objects.get_or_create(user=user, role=role)

        prompt = (
            f"Generate one challenging and well-formatted technical interview question for a {role} role.\n"
            f"Include detailed requirements and constraints, formatted nicely in Markdown for readability."
        )

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert interviewer for software engineering roles."},
                {"role": "user", "content": prompt},
            ],
        )

        question_text = response.choices[0].message.content.strip()
        Question.objects.create(text=question_text, session=session)

        return Response({
            "question": question_text,
            "session_id": session.id
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        print("❌ ERROR in generate_question:", e)
        return Response({"error": str(e)}, status=500)


# ===================================================
# 🔹 Step 2: Evaluate candidate's answer
# ===================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def evaluate_answer(request):
    question_text = request.data.get("question")
    answer_text = request.data.get("answer")
    session_id = request.data.get("session_id")

    if not question_text or not answer_text:
        return Response({"error": "Both 'question' and 'answer' are required."}, status=400)

    try:
        user = request.user
        session = UserSession.objects.filter(id=session_id, user=user).first()

        if not session:
            session = UserSession.objects.create(user=user)

        evaluation_prompt = (
            f"Question: {question_text}\n"
            f"Candidate's Answer: {answer_text}\n\n"
            "Evaluate the candidate’s response like a senior interviewer. "
            "Provide a structured Markdown answer with:\n"
            "1. ✅ Strengths\n"
            "2. ⚠️ Areas for Improvement\n"
            "3. 🧠 Summary Feedback\n"
            "4. ⭐ Rating out of 10\n"
        )

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a senior interviewer providing detailed feedback."},
                {"role": "user", "content": evaluation_prompt},
            ],
        )

        feedback = response.choices[0].message.content.strip()
        match = re.search(r"(\d+)/10", feedback)
        score = int(match.group(1)) if match else None

        Answer.objects.create(
            text=answer_text,
            feedback=feedback,
            session=session
        )

        # ✅ Save score in session for history
        session.score = score
        session.save()

        return Response({
            "feedback": feedback,
            "score": score,
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        print("❌ ERROR in evaluate_answer:", e)
        return Response({"error": str(e)}, status=500)


# ===================================================
# 🔹 Step 3: Save user session manually (for React frontend)
# ===================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_session(request):
    """Save a completed interview session."""
    user = request.user
    data = request.data

    session = UserSession.objects.create(
        user=user,
        role=data.get("role", ""),
        score=data.get("score", None)
    )
    return Response({"message": "Session saved successfully!"}, status=201)


# ===================================================
# 🔹 Step 4: Fetch all past interview sessions
# ===================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def session_history(request):
    """Return all interview sessions for the logged-in user."""
    sessions = UserSession.objects.filter(user=request.user).order_by('-started_at')

    history_data = []
    for session in sessions:
        question = Question.objects.filter(session=session).last()
        answer = Answer.objects.filter(session=session).last()

        history_data.append({
            "id": session.id,
            "role": session.role or "N/A",
            "question": question.text if question else "No question",
            "answer":answer.text if answer else "No answer",
            "feedback": answer.feedback if answer else "No feedback",
            "score": session.score or 0,
            "started_at": session.started_at,
        })

    return Response(history_data)
