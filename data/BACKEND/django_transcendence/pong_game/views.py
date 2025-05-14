import os
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.template.loader import render_to_string
from django.utils.translation import get_language, activate
from django.conf import settings
import json

# Create your views here.
def home(request):
    # if request.user.is_authenticated:
    #     # Redirect authenticated users to the profile page
    #     return HttpResponseRedirect("/profile/")
    # # Render the homepage for unauthenticated users
    # return render(request, "/home/")
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        # Render only specific blocks based on context flags
        content_html = render_to_string('home.html', {'only_content': True}, request=request)

        return JsonResponse({
            'content': content_html,
        })

    # For a full-page load, render the entire base template
    return render(request, 'base.html')

def pong_game(request):
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        # Render only specific blocks based on context flags
        content_html = render_to_string('game_menu.html', {'only_content': True}, request=request)

        return JsonResponse({
            'content': content_html,
        })

    # for a full-page load
    return render(request, 'base.html')




def translations(request):
    language = request.GET.get('lang', get_language())
    translation_path = os.path.join(settings.STATIC_ROOT, 'translations', f'{language}.json')
    fallback_path = os.path.join(settings.STATIC_ROOT, 'translations', 'en.json')
    
    try:
        with open(translation_path, 'r', encoding='utf-8') as f:
            translations_data = json.load(f)
        return JsonResponse(translations_data)
    except FileNotFoundError:
        with open(fallback_path, 'r', encoding='utf-8') as f:
            translations_data = json.load(f)
        return JsonResponse(translations_data, status=200)

def set_language(request, language_code):
    supported_languages = ['en', 'it', 'kr']
    if language_code in supported_languages:
        activate(language_code)
        response = JsonResponse({'status': 'success'})
        response.set_cookie('django_language', language_code)  # ✅ Solo il cookie è sufficiente
        return response
    else:
        return JsonResponse({'message': 'Language not set'})

    
def lang_cookie(request):
    language = request.COOKIES.get('django_language')
    return JsonResponse({'language': language})


# def login_form(request):
#     if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
#         # Render only specific blocks based on context flags
#         content_html = render_to_string('login_form.html', {'only_content': True}, request=request)

#         return JsonResponse({
#             'content': content_html,
#         })

#     # for a full-page load
#     return render(request, 'base.html')

# def signup_form(request):
#     if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
#         # Render only specific blocks based on context flags
#         content_html = render_to_string('signup_form.html', {'only_content': True}, request=request)

#         return JsonResponse({
#             'content': content_html,
#         })

#     # for a full-page load
#     return render(request, 'base.html')

# def profile(request):
#     if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
#         # Render only specific blocks based on context flags
#         content_html = render_to_string('profile.html', {'only_content': True}, request=request)

#         return JsonResponse({
#             'content': content_html,
#         })

#     # for a full-page load
#     return render(request, 'base.html')
