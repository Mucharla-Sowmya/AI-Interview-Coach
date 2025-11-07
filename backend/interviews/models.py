from django.db import models
from django.contrib.auth.models import User

class UserSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=255)
    score = models.IntegerField(null=True, blank=True, default=0)  # default 0
    started_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.role} ({self.started_at})"


class Question(models.Model):
    text = models.TextField()
    session = models.ForeignKey(UserSession, on_delete=models.CASCADE, null=True, blank=True)
    score = models.IntegerField(default=0)  # default avoids NULL

    def __str__(self):
        return f"Question {self.id}: {self.text[:50]}"


class Answer(models.Model):
    session = models.ForeignKey(UserSession, on_delete=models.CASCADE, null=True, blank=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, null=True, blank=True)
    text = models.TextField()
    feedback = models.TextField(blank=True, null=True)
    score = models.FloatField(null=True, blank=True, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Answer {self.id} for Question {self.question.id if self.question else 'N/A'}"
