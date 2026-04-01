from django.urls import path
from . import views

urlpatterns = [
    path('graph/', views.citation_graph, name='citation_graph'),
    path('extract/', views.extract_citations, name='extract_citations'),
    path('statistics/', views.citation_statistics, name='citation_statistics'),
    path('<str:paper_id>/', views.paper_citations, name='paper_citations'),
]
