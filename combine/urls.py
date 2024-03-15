from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("collection/new/", views.new, name="new_collection"),
    path("collection/create/", views.create, name="create_collection"),
    path("collection/<int:collection_id>/", views.collection, name="collection"),
    path("data/collection/<int:collection_id>/", views.itemsJSON, name="itemsJSON")
]
