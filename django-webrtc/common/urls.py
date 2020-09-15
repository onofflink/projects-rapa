

from django.contrib import admin
from django.urls import path, include

from . import views

#'board' is not a registered namespace
app_name='common' #이렇게 써줘야 없어진다  

urlpatterns = [
    path('', views.index),
    path('save', views.save, name="write"), #http://127.0.0.1/board/write     
]