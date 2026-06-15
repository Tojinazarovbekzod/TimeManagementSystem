from django.contrib import admin

from .models import Category, Task


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'color', 'created_at')
    list_filter = ('user',)
    search_fields = ('name', 'user__username')


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'category', 'priority', 'status', 'due_date', 'created_at')
    list_filter = ('status', 'priority', 'category')
    search_fields = ('title', 'description', 'user__username')
    date_hierarchy = 'created_at'
