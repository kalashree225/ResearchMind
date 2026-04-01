from django.urls import path
from . import views

urlpatterns = [
    path('cluster/', views.generate_clusters, name='generate_clusters'),
    path('clusters/<int:cluster_id>/', views.cluster_details, name='cluster_details'),
]
