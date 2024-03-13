import sys

from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, JsonResponse
from django.template import loader

from .models import Collection, Part, Item
import json

def test(request):
    return HttpResponse("This is a test")

def collection(request, collection_id):
    template = loader.get_template("collection.html")
    collections = Collection.objects.all()
    c = Collection.objects.get(pk=collection_id)
    context = {
        "collections": collections,
        "id": collection_id,
        "collection_name": c.name
        }
    return HttpResponse(template.render(context, request))

def itemsJSON(request, collection_id):
    c = Collection.objects.get(pk=collection_id)
    data = {}
    for p in c.part_set.all():
        items = []
        for i in p.item_set.all():
            items.append(i.value)
        data[p.name] = items
    return JsonResponse(data, safe=False)
