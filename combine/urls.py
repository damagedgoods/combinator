from django.urls import path

from . import views

urlpatterns = [
    path("collection/<int:collection_id>/", views.collection, name="collection"),
    path("data/collection/<int:collection_id>/", views.itemsJSON, name="itemsJSON")
]
