from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now

class OAuthToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Relazione 1:1 con l'utente
    access_token = models.TextField()  # Salva il token
    created_at = models.DateTimeField(default=now)  # Data di creazione

