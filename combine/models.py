from django.db import models
from slugify import slugify

# Create your models here.

class Collection(models.Model):
    name = models.CharField(max_length=200)
    highlighted = models.BooleanField(default=False)
    slug = models.SlugField(default="", null=False)
    def __str__(self):
        return self.name
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

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
