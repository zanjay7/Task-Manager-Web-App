from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Task
from .serializers import TaskSerializer
from .permissions import IsOwner


class TaskViewSet(viewsets.ModelViewSet):
    
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'due_date', 'priority']

    def get_queryset(self):
        queryset = Task.objects.filter(user=self.request.user)
        status_param = self.request.query_params.get('status')
        if status_param == 'completed':
            queryset = queryset.filter(completed=True)
        elif status_param == 'pending':
            queryset = queryset.filter(completed=False)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        qs = Task.objects.filter(user=request.user)
        total = qs.count()
        completed = qs.filter(completed=True).count()
        percentage = round((completed / total) * 100, 1) if total else 0
        return Response({
            'total': total,
            'completed': completed,
            'pending': total - completed,
            'completed_percentage': percentage,
        })
