# Generated by Django 5.0.3 on 2024-05-22 19:07

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("combine", "0002_collection_highlighted"),
    ]

    operations = [
        migrations.AddField(
            model_name="collection",
            name="slug",
            field=models.SlugField(default=""),
        ),
    ]
