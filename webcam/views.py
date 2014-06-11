from django.template.loader import get_template
from django.template import RequestContext
from django.http import HttpResponse


def webcam(request):
    context = RequestContext(request)
    t = get_template('../templates/webcam.html')
    html = t.render(context)
    return HttpResponse(html)