from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Category, Task

User = get_user_model()


class CategoryTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='alice', password='testpass123')
        self.client.force_authenticate(user=self.user)

    def test_create_category(self):
        response = self.client.post('/api/categories/', {'name': 'Work', 'color': '#ff0000'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.get().user, self.user)

    def test_list_categories_only_returns_own(self):
        other = User.objects.create_user(username='bob', password='testpass123')
        Category.objects.create(user=other, name='Personal')
        Category.objects.create(user=self.user, name='Work')

        response = self.client.get('/api/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        names = [c['name'] for c in response.data]
        self.assertEqual(names, ['Work'])


class TaskTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='alice', password='testpass123')
        self.client.force_authenticate(user=self.user)
        self.category = Category.objects.create(user=self.user, name='Work')

    def test_create_task(self):
        response = self.client.post('/api/tasks/', {
            'title': 'Write report',
            'category': self.category.id,
            'priority': 'high',
            'status': 'todo',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.get().title, 'Write report')

    def test_cannot_assign_other_users_category(self):
        other = User.objects.create_user(username='bob', password='testpass123')
        other_category = Category.objects.create(user=other, name='Personal')

        response = self.client.post('/api/tasks/', {
            'title': 'Sneaky task',
            'category': other_category.id,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_tasks_only_returns_own(self):
        other = User.objects.create_user(username='bob', password='testpass123')
        Task.objects.create(user=other, title='Other task')
        Task.objects.create(user=self.user, title='My task')

        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [t['title'] for t in response.data]
        self.assertEqual(titles, ['My task'])

    def test_filter_tasks_by_status(self):
        Task.objects.create(user=self.user, title='Todo task', status='todo')
        Task.objects.create(user=self.user, title='Done task', status='done')

        response = self.client.get('/api/tasks/?status=done')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [t['title'] for t in response.data]
        self.assertEqual(titles, ['Done task'])

    def test_unauthenticated_access_denied(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
