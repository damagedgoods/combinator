from django.contrib import admin
from .models import Collection, Part, Item

admin.site.register(Collection)
admin.site.register(Part)
admin.site.register(Item)