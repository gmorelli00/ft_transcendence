from django.urls import path
from .views import login_42, oauth_callback, check_auth, logout_view

urlpatterns = [
    path('login/', login_42, name='login_42'),
    path('auth/callback/', oauth_callback, name='oauth_callback'),
    path("check-auth/", check_auth, name="check_auth"),
    path("logout/", logout_view, name="logout"),
]