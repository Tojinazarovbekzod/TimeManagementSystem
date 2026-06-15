from django.contrib.auth import get_user_model

User = get_user_model()


class AppUser(User):
    class Meta:
        proxy = True
        verbose_name = 'Foydalanuvchi'
        verbose_name_plural = 'Foydalanuvchilar'
