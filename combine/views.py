import sys
import csv

from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, JsonResponse
from django.template import loader
from django.shortcuts import redirect
from slugify import slugify

from .models import Collection, Part, Item
import json

def index(request):    
    template = loader.get_template("index.html")
    collections = Collection.objects.filter(highlighted=True)
    context = {
        "collections": collections
    }
    return HttpResponse(template.render(context, request))

def new(request):
    template = loader.get_template("new.html")
    context = {
    }
    return HttpResponse(template.render(context, request))

def create(request):
    name = request.POST.get('name')
    password = request.POST.get('password')

    # Check if the slug already exists, return error if it does
    existingSlugs = Collection.objects.filter(slug=slugify(name))
    if len(existingSlugs) > 0:
        template = loader.get_template("new.html")
        context = {
            "name": name,
            "nameError": "already exists."
        }
        return HttpResponse(template.render(context, request))

    if request.FILES:

        # Check if the file can be parsed, return error if it can't
        try:
            content = request.FILES['fileInput'].read().decode('utf-8')
        except:
            print("Error managing the file")
            template = loader.get_template("new.html")
            context = {
                "name": name,
                "fileError": "is not valid."
            }
            return HttpResponse(template.render(context, request))

        c = Collection(name=name)
        c.save()

        # Process the first one to know number of columns and create Parts
        firstLine = content.partition('\n')[0]
        columns = firstLine.strip().split(';')
        parts = []
        pos = 0
        for column in columns:
            pos += 1
            if len(column) > 0:
                newPart = Part(name="part"+str(pos), collection=c)
                newPart.save()
                parts.append(newPart)

        # Then process the rest of lines to create Items
        for row in content.splitlines():
            newValues = row.strip().split(';')        
            pos = 0
            for v in newValues:
                if len(v) > 0:
                    part = parts[pos]            
                    newItem = Item(value=v, part=part)
                    newItem.save()
                    pos += 1

    return redirect("collection", slug=c.slug)

def collection(request, slug):
    template = loader.get_template("collection.html")
    collections = Collection.objects.all()
    c = Collection.objects.get(slug=slug)
    context = {
        "collections": collections,
        "id": c.id,
        "slug": slug,
        "collection_name": c.name
        }
    return HttpResponse(template.render(context, request))

def edit(request, slug):
    template = loader.get_template("edit.html")
    c = Collection.objects.get(slug=slug)

    data = []
    parts = Part.objects.filter(collection=c)
    for p in parts:
        data.append({"partId": p.pk, "partName": p.name, "items": Item.objects.filter(part=p)})

    context = {
        "collection": c,
        "collection_name": c.name,
        "data": data,
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

def deleteItemJSON(request, item_id):
    i = Item.objects.get(pk=item_id)
    i.delete()
    data = {}
    data["message"] = "OK"
    return JsonResponse(data, safe=False)

def newItemJSON(request):    

    # Extract values and create new element
    body = json.loads(request.body)
    partId = body['part']
    value = body['value']

    p = Part.objects.get(pk=partId)
    i = Item(value=value, part=p)
    i.save()

    # Return response
    data = {}
    data["message"] = "OK"
    data["id"] = i.pk
    return JsonResponse(data, safe=False)
