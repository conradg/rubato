from django.conf.urls import patterns, include, url
from django.contrib import admin
from reinhardt import views

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'reinhardt.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^index/$', views.index),
    url(r'^interval/$', views.interval),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^login/$',  views.user_login),
    url(r'^logout/$',  views.user_logout),
    url(r'^exercises/$',  views.exercises),
    url(r'^learn/$',  views.learn),
    url(r'^profile/$',  views.profile),
    url(r'^interval/score',  views.sendIntervalScore),

)