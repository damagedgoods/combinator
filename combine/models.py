from django.db import models

# Create your models here.

class Collection(models.Model):
    name = models.CharField(max_length=200)
    highlighted = models.BooleanField(default=False)
    def __str__(self):
        return self.name

class Part(models.Model):
    name = models.CharField(max_length=200)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    def __str__(self):
        return self.name

class Item(models.Model):
    value = models.CharField(max_length=200)
    part = models.ForeignKey(Part, on_delete=models.CASCADE)
    def __str__(self):
        return self.value
