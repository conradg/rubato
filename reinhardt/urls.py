from django.conf.urls import patterns, include, url
from django.contrib import admin
from reinhardt.views import interval

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'reinhardt.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^polls/', include('polls.urls')),
    url(r'^interval/$', interval),
    url(r'^admin/', include(admin.site.urls)),
)
