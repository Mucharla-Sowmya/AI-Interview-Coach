from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import IntegrityError  # ✅ Added this import
from .serializers import LoginSerializer

User = get_user_model()


# ====================================================
# 🧩 REGISTER USER
# ====================================================
@api_view(['POST'])
def register_user(request):
    data = request.data
    print("📥 Register API hit with data:", data)

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # ✅ Validate required fields
    if not username or not email or not password:
        return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ Prevent duplicates
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already registered.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # ✅ Create user
        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()

        # ✅ Auto-generate JWT tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'User registered successfully.',
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }, status=status.HTTP_201_CREATED)

    except IntegrityError:
        return Response({'error': 'User already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print("❌ Error in register_user:", str(e))
        return Response({'error': 'Something went wrong.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ====================================================
# 🧩 LOGIN USER (JWT)
# ====================================================
@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request):
    """
    Authenticates a user and returns access + refresh JWT tokens.
    """
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data

        # Create JWT tokens
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        return Response(
            {
                "message": "✅ Login successful!",
                "username": user.username,
                "access": str(access),
                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ====================================================
# 🧩 LOGOUT USER (JWT Blacklist)
# ====================================================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_user(request):
    """
    Logs out a user by blacklisting their refresh token.
    """
    try:
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"error": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response(
            {"message": "👋 Successfully logged out."},
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        print("Logout error:", e)
        return Response(
            {"error": "Invalid or expired token."},
            status=status.HTTP_400_BAD_REQUEST,
        )
