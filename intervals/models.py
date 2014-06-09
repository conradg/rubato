from django.db import models


class Interval(models.Model):
    semitones = models.IntegerField()
    up = models.BooleanField(default=True)
    name = models.CharField(max_length=128)
    def __str__(self):
        return self.name

class IntervalScore(models.Model):
    interval = models.ForeignKey(Interval)
    timestamp = models.DateTimeField(auto_now_add=True)
    score = models.FloatField();
    def __str__(self):
        return self.interval.name + " Score: " + str(self.score)
