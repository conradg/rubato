__author__ = 'Conrad'

from django.template.loader import get_template
from django.template import Context, RequestContext
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.shortcuts import redirect, render_to_response


def interval(request):
    context = RequestContext(request)
    t = get_template('../templates/interval.html')
    html = t.render(context)
    return HttpResponse(html)

def user_login(request):
    context = RequestContext(request)
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                return redirect('/interval')
            else:
                return redirect('/login/account-disabled')
                # Return a 'disabled account' error message
        else:
            return redirect('/login/invalid-login')
            # Return an 'invalid login' error message.
    else:
        return render_to_response('../templates/registration/login.html', {}, context)

def index(request):
    context = RequestContext(request)
    t = get_template('../templates/index.html')
    html = t.render(context)
    return HttpResponse(html)