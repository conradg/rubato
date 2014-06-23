__author__ = 'Conrad'

from django.template.loader import get_template
from django.template import Context, RequestContext
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login
from django.shortcuts import redirect, render_to_response
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie
from intervals import learning
import time, datetime
import logging
logger = logging.getLogger(__name__)



def user_login(request):
    context = RequestContext(request)
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                return redirect('/index')
            else:
                return redirect('/login/account-disabled')
                # Return a 'disabled account' error message
        else:
            return redirect('/login/invalid-login')
            # Return an 'invalid login' error message.
    else:
        return render_to_response('../templates/registration/login.html', {}, context)

@login_required
def user_logout(request):
    logout(request)
    return HttpResponseRedirect('/index/')

def index(request):
    context = RequestContext(request)
    t = get_template('../templates/index.html')
    html = t.render(context)
    return HttpResponse(html)

def learn(request):
    context = RequestContext(request)
    t = get_template('../templates/learn.html')
    html = t.render(context)
    return HttpResponse(html)

def exercises(request):
    context = RequestContext(request)
    t = get_template('../templates/exercises.html')
    html = t.render(context)
    return HttpResponse(html)

@login_required
def profile(request):
    context = RequestContext(request)

    user_id_str = request.session['_auth_user_id']
    user_id = int(user_id_str)

    best_interval_week = learning.best_interval(user_id )
    worst_interval_week = learning.worst_interval(user_id)

    t = get_template('../templates/profile.html')
    html = t.render(context)
    return HttpResponse(html)
