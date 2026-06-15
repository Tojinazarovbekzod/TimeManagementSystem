from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from .models import AppUser

User = get_user_model()


class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_active', 'is_staff', 'date_joined', 'last_login', 'task_count')
    list_filter = UserAdmin.list_filter + ('date_joined',)
    ordering = ('-date_joined',)

    @admin.display(description='Vazifalar soni')
    def task_count(self, obj):
        return obj.tasks.count()


admin.site.unregister(User)
admin.site.register(AppUser, CustomUserAdmin)
