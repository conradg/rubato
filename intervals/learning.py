__author__ = 'Conrad'
from intervals.models import Interval, IntervalScore
from profiles.models import UserProfile
import random


def get_next_interval(user_id):
    level = UserProfile.objects.get(user__id=user_id).level;

    interval_set = level_to_interval_set[level]
    interval_averages = []
    for i in interval_set:
        interval_averages.append((i,recent_average_score(user_id,i)))
    print(interval_averages)
    return random.choice(interval_set)


def recent_average_score(user_id,_interval):
    last_10 = IntervalScore.objects.filter(user=user_id,interval=_interval).order_by("-timestamp")[:10]
    acc = 0
    count = 0
    for x in last_10:
        acc += x.score
        count += 1
    return acc/count

def best_interval(user_id,date_time):
    time = date_time.timestamp()
    history = IntervalScore.objects.filter(user=user_id, timestamp__timestamp__gte=time);


easy_intervals = [Interval.objects.get(name="unison"),
                  Interval.objects.get(name="major second", up=True),
                  Interval.objects.get(name="perfect fifth", up=True),
                  Interval.objects.get(name="octave", up=True),
                  Interval.objects.get(name="octave", up=False),
                  ]

medium_intervals = easy_intervals + [
                  Interval.objects.get(name="major second", up=False),
                  Interval.objects.get(name="perfect fifth", up=False),
                  Interval.objects.get(name="major third", up=True),
                  Interval.objects.get(name="major third", up=False),
                  Interval.objects.get(name="minor second", up=True),
                  Interval.objects.get(name="minor second", up=False),
                  Interval.objects.get(name="minor third", up=True),
                  Interval.objects.get(name="minor third", up=False),
                  Interval.objects.get(name="perfect fourth", up=True),
                  Interval.objects.get(name="perfect fourth", up=False),
                  ]

hard_intervals = medium_intervals + [
                  Interval.objects.get(name="diminished fifth", up=True),
                  Interval.objects.get(name="diminished fifth", up=False),
                  Interval.objects.get(name="minor sixth", up=True),
                  Interval.objects.get(name="minor sixth", up=False),
                  Interval.objects.get(name="major sixth", up=True),
                  Interval.objects.get(name="major sixth", up=False),
                  Interval.objects.get(name="minor seventh", up=True),
                  Interval.objects.get(name="minor seventh", up=False),
                  Interval.objects.get(name="major seventh", up=True),
                  Interval.objects.get(name="major seventh", up=False),
                  ]

level_to_interval_set = {
    1:easy_intervals,
    2:medium_intervals,
    3:hard_intervals
}


def update_level(user_id,score):
    user = UserProfile.objects.get(user__id = user_id)
    print(score)
    if score>0.5:
        user.exp+=0.025
    else:
        user.exp-=0.01
    if user.exp<-0.04 and user.level> 0:
        user.level-=1
        user.exp = 0
    if user.exp>1 and user.level<5:
        user.level+=1
        user.exp = 0

    user.save()