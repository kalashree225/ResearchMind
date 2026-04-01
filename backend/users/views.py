from django.shortcuts import redirect
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
import os

@api_view(['GET'])
@permission_classes([AllowAny])  # Allow unauthenticated access
def google_login(request):
    """Redirect to Google OAuth"""
    return redirect('social:begin', backend='google-oauth2')

@api_view(['GET'])
@permission_classes([AllowAny])  # Allow unauthenticated access
def github_login(request):
    """Redirect to GitHub OAuth"""
    return redirect('social:begin', backend='github')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """Get current user info"""
    user = request.user
    return Response({
        'id': str(user.id),
        'email': user.email,
        'username': user.username,
        'name': user.get_full_name(),
        'avatar_url': user.avatar_url,
    })

def generate_tokens_for_user(user):
    """Generate JWT tokens for user"""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
