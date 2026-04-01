from django.urls import path
from . import views

urlpatterns = [
    path('', views.upload_paper, name='upload_paper'),
    path('list/', views.list_papers, name='list_papers'),
    path('compare/', views.compare_papers, name='compare_papers'),
    path('<str:paper_id>/status/', views.paper_status, name='paper_status'),
    path('<str:paper_id>/summary/', views.paper_summary, name='paper_summary'),
    path('<str:paper_id>/', views.delete_paper, name='delete_paper'),
]
