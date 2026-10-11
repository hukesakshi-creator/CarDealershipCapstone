from django.db import models
from django.contrib.auth.models import User
class Review(models.Model):
    dealer_id = models.IntegerField()
    username = models.CharField(max_length=150, default='Guest')
    purchase = models.CharField(max_length=120, default='General')
    review = models.TextField()
    purchase_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return f'{self.username}: dealer {self.dealer_id}'
