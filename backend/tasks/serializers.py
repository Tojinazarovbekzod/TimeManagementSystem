from rest_framework import serializers

from .models import Category, Task


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'color', 'created_at']
        read_only_fields = ['id', 'created_at']


class TaskSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'category', 'category_name',
            'priority', 'status', 'due_date', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_category(self, category):
        if category is not None:
            request = self.context['request']
            if category.user != request.user:
                raise serializers.ValidationError("Category not found.")
        return category
