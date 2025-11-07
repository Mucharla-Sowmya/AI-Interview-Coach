
from django.contrib import admin
from .models import UserSession, Question, Answer

admin.site.register(UserSession)
admin.site.register(Question)
admin.site.register(Answer)
