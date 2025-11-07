from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"questions", views.QuestionViewSet)
router.register(r"answers", views.AnswerViewSet)
router.register(r"sessions", views.UserSessionViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("generate-question/", views.generate_question, name="generate-question"),
    path("evaluate-answer/", views.evaluate_answer, name="evaluate-answer"),
    path("save-session/", views.save_session, name="save-session"),
    path("session-history/", views.session_history, name="session-history"),
]
