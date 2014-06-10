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
    print("hi")
    context = RequestContext(request)
    if request.method != 'POST':
        return HttpResponse("error")

    score_str = request.POST['score']
    semitones_str = request.POST['interval']

    score = float(score_str)
    semitones = int(semitones_str)

    interval = Interval.objects.filter(semitones=semitones)[0] #return database entry matching that interval


    interval_score = IntervalScore.objects.create(score=score, interval=interval)

    print (interval_score)
    timestamp = interval_score.timestamp
    return HttpResponse(timestamp)

def getInterval(request):
    context = RequestContext(request)

    next_interval = learning.get_next_interval() #return database entry matching that interval

    print (next_interval)
    interval_semitones = str(next_interval.semitones)
    print("made it all the way to the end")
    return HttpResponse(interval_semitones)