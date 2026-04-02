from django.shortcuts import redirect
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
import os

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Email/password login endpoint"""
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response(
            {'error': 'Email and password required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Find user by email
    try:
        user = User.objects.get(email=email)
        # Authenticate with username (Django uses username not email)
        authenticated_user = authenticate(username=user.username, password=password)
        
        if authenticated_user:
            tokens = generate_tokens_for_user(authenticated_user)
            return Response({
                'access': tokens['access'],
                'refresh': tokens['refresh'],
                'user': {
                    'id': str(authenticated_user.id),
                    'email': authenticated_user.email,
                    'name': authenticated_user.get_full_name() or authenticated_user.username
                }
            })
        else:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_401_UNAUTHORIZED
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Email/password registration endpoint"""
    email = request.data.get('email')
    password = request.data.get('password')
    name = request.data.get('name', '')
    
    if not email or not password:
        return Response(
            {'error': 'Email and password required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if user already exists
    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'Email already registered'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Create user (use email as username for uniqueness)
    username = email.split('@')[0] + '_' + str(User.objects.count())
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=name.split()[0] if name else '',
        last_name=' '.join(name.split()[1:]) if len(name.split()) > 1 else ''
    )
    
    tokens = generate_tokens_for_user(user)
    return Response({
        'access': tokens['access'],
        'refresh': tokens['refresh'],
        'user': {
            'id': str(user.id),
            'email': user.email,
            'name': user.get_full_name() or user.username
        }
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([AllowAny])
def google_login(request):
    """Redirect to Google OAuth"""
    return redirect('social:begin', backend='google-oauth2')

@api_view(['GET'])
@permission_classes([AllowAny])
def github_login(request):
    """Redirect to GitHub OAuth"""
    return redirect('social:begin', backend='github')

@api_view(['GET'])
@permission_classes([AllowAny])
def current_user(request):
    """Get current user info"""
    # Without auth, return a demo user
    return Response({
        'id': '1',
        'email': 'demo@example.com',
        'username': 'demo_user',
        'name': 'Demo User',
        'avatar_url': getattr(user, 'avatar_url', None),
    })

def generate_tokens_for_user(user):
    """Generate JWT tokens for user"""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
