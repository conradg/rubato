from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User)
    level = models.PositiveIntegerField()
    exp = models.FloatField()
    gender = models.CharField(max_length=1, choices=(("m","male"),("f","female")))
    def __str__(self):
        return self.user.username