from django.urls import path
from . import views

app_name = 'pong_game'

urlpatterns = [
    path('', views.home, name='home'),
    path('pong_game/', views.pong_game, name='pong_game'),
    path('translations/', views.translations, name='translations'),  # Nome corretto
    path('set_language/<str:language_code>/', views.set_language, name='set_language'),  # Aggiunto per cambiare lingua
    path('lang_cookie/', views.lang_cookie, name='lang_cookie'),  # Aggiunto per cambiare lingua
    # path('profile/', views.signup_form, name='profile'),
]
