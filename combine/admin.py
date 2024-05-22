from django.contrib import admin
from .models import Collection, Part, Item

class CollectionAdmin(admin.ModelAdmin):
    list_display = ['name','highlighted', 'slug']
    prepopulated_fields = {"slug": ("name",)}

admin.site.register(Collection, CollectionAdmin)
admin.site.register(Part)
admin.site.register(Item)