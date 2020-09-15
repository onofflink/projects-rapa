from django.db import models

# Create your models here.
class Board(models.Model):
  id = models.AutoField(primary_key=True)
  d_id = models.CharField(max_length=200)
  img_path = models.FilePathField(max_length=100)
  wdate = models.DateTimeField() 
  hit = models.IntegerField()  
