# from django.shortcuts import render
import requests
from django.http import JsonResponse, HttpResponseRedirect
from django.conf import settings
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from .models import OAuthToken

# Create your views here.

def login_42(request):
    auth_url = f"{settings.AUTH_URL}"
    return HttpResponseRedirect(auth_url)

def oauth_callback(request):
    code = request.GET.get('code')
    
    if not code:
        return JsonResponse({'error': 'No code provided'}, status=400)
    
    token_url = f"{settings.TOKEN_URL}"
    data = {
        'grant_type': 'authorization_code',
        'client_id': settings.CLIENT_ID,
        'client_secret': settings.CLIENT_SECRET,
        'code': code,
        'redirect_uri': settings.REDIRECT_URI
    }

    response = requests.post(token_url, data=data)

    print("Token Response:", response.json())
    if response.status_code != 200:
        return JsonResponse({'error': 'Invalid code'}, status=400)
    
    access_token = response.json().get('access_token')
    # if not access_token:
    #     return JsonResponse({'error': 'Invalid code'}, status=400)

    # user_info_url = f"{settings.USER_INFO_URL}?access_token={access_token}"
    user_info_url = requests.get("https://api.intra.42.fr/v2/me", headers={"Authorization": f"Bearer {access_token}"})
    if user_info_url.status_code != 200:
        return JsonResponse({'error': 'Invalid access token'}, status=400)
    
    user_data = user_info_url.json()


    # return JsonResponse({
    #     "access_token": access_token,
    #     "user_data": user_data
    # })
    frontend_url = "http://localhost:8000/pong_game/"
    response = HttpResponseRedirect(frontend_url)
     # Verifica se l'utente esiste già
    user, created = User.objects.get_or_create(username=user_data["login"], email=user_data["email"])
    
    # Salva o aggiorna il token nel database
    OAuthToken.objects.update_or_create(user=user, defaults={'access_token': access_token})

    # Salvataggio del token in un cookie HTTP-Only
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,  # Protezione da XSS
        secure=False,   # Metti True se usi HTTPS
        samesite="Lax", # Per evitare attacchi CSRF
    )
    response.set_cookie(
        key="username",
        value=user_data["login"],
        httponly=False,  # Questo deve essere accessibile dal JS
        secure=False,
        samesite="Lax",
    )

    return response

def check_auth(request):
    access_token = request.COOKIES.get("access_token")
    
    if not access_token:
        return JsonResponse({"authenticated": False})

    return JsonResponse({"authenticated": True})


@csrf_exempt
def logout_view(request):
    response = JsonResponse({"message": "Logout effettuato con successo"})
    response.delete_cookie("access_token")  # 🔥 Elimina il cookie!
    return response