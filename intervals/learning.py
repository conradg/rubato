__author__ = 'Conrad'
from intervals.models import Interval


def get_next_interval():
    return Interval.objects.filter(name="unison")[0]


