from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("howto/", views.howto, name="howto"),
    path("about/", views.about, name="about"),
    path("collection/new/", views.new, name="new_collection"),
    path("collection/create/", views.create, name="create_collection"),    
    path("collection/<slug:slug>/", views.collection, name="collection"),
    path("collection/<slug:slug>/edit", views.edit, name="edit"),
    path("data/collection/<int:collection_id>/", views.itemsJSON, name="itemsJSON"),
    path("data/item/delete/<int:item_id>/", views.deleteItemJSON, name='deleteItemJSON'),
    path("data/item/new/", views.newItemJSON, name='newItemJSON'),
]

