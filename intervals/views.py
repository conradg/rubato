from django.shortcuts import render

from intervals.models import IntervalScore, Interval
from django.views.decorators.csrf import ensure_csrf_cookie
from django.template.loader import get_template
from django.template import RequestContext
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from intervals import learning;

@login_required
@ensure_csrf_cookie

def interval(request):
    context = RequestContext(request)
    t = get_template('../templates/interval.html')
    html = t.render(context)
    return HttpResponse(html)

def sendIntervalScore(request):
    if request.method != 'POST':
        return HttpResponse("error")

    score_str = request.POST['score']
    semitones_str = request.POST['interval']

    score = float(score_str)
    semitones = int(semitones_str)

    user_id_str = request.session['_auth_user_id']
    user_id = int(user_id_str)

    send_interval = Interval.objects.get(semitones=semitones) #return database entry matching that interval
    interval_score = IntervalScore.objects.create(score=score, interval=send_interval, user=user_id)

    print (interval_score)
    timestamp = interval_score.timestamp
    return HttpResponse(timestamp)

def getInterval(request):
    user_id = request.session['_auth_user_id']
    next_interval = learning.get_next_interval(user_id) #return database entry matching that interval

    print (next_interval)
    interval_semitones = str(next_interval.semitones)
    return HttpResponse(interval_semitones)