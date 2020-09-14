from django.db import models

# Create your models here.
class Board(models.Model):
  id = models.AutoField(primary_key=True)
  title = models.CharField(max_length=200)
  contents = models.TextField() 
  wdate = models.DateTimeField() 
  writer = models.CharField(max_length=50)
  hit = models.IntegerField()  
