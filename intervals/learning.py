__author__ = 'Conrad'
from intervals.models import Interval, IntervalScore
from profiles.models import UserProfile
import random


def get_next_interval(user_id):
    level = UserProfile.objects.get(user__id=user_id).level;
    history = IntervalScore.objects.filter(user=user_id)
    available_intervals = level_to_interval_set[level]

    if len(history)<10:
        return random.choice(available_intervals)

    interval_averages = []

    # Array of intervals for the given level
    for intvl in available_intervals:
        interval_averages.append((intvl,recent_average_score(user_id,intvl)))

    interval_weightings = []
    acc = 0
    for a in interval_averages:
        avg_score = a[1]
        interval_weightings.append(1/(a[1]+0.25))
        acc += 1/(a[1]+0.25)
    interval_weightings_norm = []
    total = 0
    for w in interval_weightings:
        interval_weightings_norm.append(w/acc + total)
        total += w/acc
    rand = random.random()
    for x in range(0, len(interval_weightings_norm)):
        if interval_weightings_norm[x]>rand:
            return available_intervals[x]
        else:
            pass


# Gets the average score over the last 10 attempts at a given interval
def recent_average_score(user_id,_interval):
    last_10 = IntervalScore.objects.filter(user=user_id,interval=_interval).order_by("-timestamp")[:10]
    if len(last_10) == 0:
        return 0.5
    acc = 0
    for x in last_10:
        acc += x.score
    return acc/len(last_10)

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
