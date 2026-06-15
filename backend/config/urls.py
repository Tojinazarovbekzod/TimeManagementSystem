from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def api_root(request):
    return JsonResponse({
        'message': 'TimeManagement API ishlayapti',
        'endpoints': {
            'admin': '/admin/',
            'register': '/api/auth/register/',
            'token': '/api/auth/token/',
            'token_refresh': '/api/auth/token/refresh/',
            'me': '/api/auth/me/',
            'categories': '/api/categories/',
            'tasks': '/api/tasks/',
        },
    })


urlpatterns = [
    path('', api_root),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('tasks.urls')),
]
