from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("collection/new/", views.new, name="new_collection"),
    path("collection/create/", views.create, name="create_collection"),
    path("collection/<int:collection_id>/", views.collection, name="collection"),
    path("collection/<int:collection_id>/edit", views.edit, name="edit"),
    path("data/collection/<int:collection_id>/", views.itemsJSON, name="itemsJSON"),
    path("data/item/delete/<int:item_id>/", views.deleteItemJSON, name='deleteItemJSON'),
]

