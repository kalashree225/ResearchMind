from django.urls import path
from . import views

urlpatterns = [
    path('', views.send_message, name='send_message'),
    path('sessions/', views.list_sessions, name='list_sessions'),
    path('sessions/<str:session_id>/', views.get_session, name='get_session'),
    path('sessions/<str:session_id>/delete/', views.delete_session, name='delete_session'),
]
