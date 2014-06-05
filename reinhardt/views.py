__author__ = 'Conrad'

from django.template.loader import get_template
from django.template import Context
from django.http import HttpResponse

def interval(request):
    t = get_template('interval.html')
    html = t.render(Context({}))
    return HttpResponse(html)