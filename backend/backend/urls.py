from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.http import JsonResponse

def root_view(request):
    return JsonResponse({"message": "Welcome to the Interview API!"})

urlpatterns = [
    path("", root_view),  # Root URL
    path("admin/", admin.site.urls),
    path("api/users/", include("users.urls")),
    path("api/interviews/", include("interviews.urls")),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
