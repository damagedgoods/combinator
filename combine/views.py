import sys
import csv

from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, JsonResponse
from django.template import loader
from django.shortcuts import redirect


from .models import Collection, Part, Item
import json

def index(request):    
    template = loader.get_template("index.html")
    collections = Collection.objects.all()
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
    # print(str(name)+" - "+str(password))
    c = Collection(name=name)
    c.save()
    
    # Read file and create parts & items
    csvFile = request.FILES['csv']
    #data = str(csvFile.read())
    #print("Data: "+str(data))
    
    csvFile.seek(0)
    reader = csv.reader(csvFile.read().decode('utf-8'))
    
    for row in reader:
        print("-"+str(row))

    return redirect("index")

"""
    lines = data.splitlines()
    print("Mirando líneas")
    for line in lines:
        print("-"+line)
    print("Miradas")

        csvreader = csv.reader(csvFile)
    for row in csvreader:
        print(row)

    

    csv_data = pd.read_csv(
        io.StringIO(
            csv.read().decode("utf-8")
        )
    )
    """
    

"""
    for record in csv_data.to_dict(orient="records"):
        try:
            Students.objects.create(
                first_name = record['first_name'],
                last_name = record['last_name'],
                marks = record['marks'],
                roll_number = record['roll_number'],
                section = record['section']
            )
        except Exception as e:
            context['exceptions_raised'] = e
"""

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
