from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class RegisterTests(APITestCase):
    def test_register_creates_user(self):
        url = reverse('register')
        response = self.client.post(url, {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'strongpassword123',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_register_with_short_password_fails(self):
        url = reverse('register')
        response = self.client.post(url, {
            'username': 'shortpass',
            'email': 'shortpass@example.com',
            'password': '123',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class AuthFlowTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', email='testuser@example.com', password='testpass123',
        )

    def test_obtain_token(self):
        url = reverse('token_obtain_pair')
        response = self.client.post(url, {
            'username': 'testuser',
            'password': 'testpass123',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_me_requires_authentication(self):
        url = reverse('me')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_returns_current_user(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('me')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

    def test_change_password(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('change_password')
        response = self.client.post(url, {
            'old_password': 'testpass123',
            'new_password': 'newpassword456',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpassword456'))

    def test_change_password_with_wrong_old_password(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('change_password')
        response = self.client.post(url, {
            'old_password': 'wrongpassword',
            'new_password': 'newpassword456',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
