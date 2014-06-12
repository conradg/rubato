__author__ = 'Conrad'
from intervals.models import Interval
import random


def get_next_interval(user_id):
    return random.choice(easy_intervals)


easy_intervals = [Interval.objects.get(name="unison"),
                  Interval.objects.get(name="major second", up="true"),
                  Interval.objects.get(name="perfect fifth", up="true"),
                  Interval.objects.get(name="octave", up="true"),
                  Interval.objects.get(name="octave", up="false"),
                  ]

medium_intervals = []

hard_intervals = []