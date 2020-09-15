from django.db import models

# Create your models here.
class DroneDataModels(models.Model):
  id = models.AutoField(primary_key=True)
  d_id = models.CharField(max_length=100)
  img_path = models.CharField(max_length=200)
  img_name = models.CharField(max_length=200) 
  x = models.FloatField()
  y = models.FloatField()
  address = models.CharField(max_length=200)
  
