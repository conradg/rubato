from django.conf.urls import patterns, include, url
from django.contrib import admin
from reinhardt import views

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'reinhardt.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', views.index, name="index"),
    url(r'^index/$', views.index),
    url(r'^interval/$', 'intervals.views.interval', name="interval"),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^login/',  views.user_login, name="login"),
    url(r'^logout/$',  views.user_logout, name="logout"),
    url(r'^exercises/$',  views.exercises, name="exercises"),
    url(r'^learn/$',  views.learn),
    url(r'^profile/$',  views.profile, name="profile"),
    url(r'^interval/send_score',  'intervals.views.sendIntervalScore'),
    url(r'^interval/get_interval', 'intervals.views.getInterval'),




)
