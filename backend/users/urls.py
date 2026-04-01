from django.urls import path
from . import views

urlpatterns = [
    path('google/', views.google_login, name='google_login'),
    path('github/', views.github_login, name='github_login'),
    path('me/', views.current_user, name='current_user'),
]
