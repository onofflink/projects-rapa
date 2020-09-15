from django.shortcuts import render
from django.http import HttpResponse
import time
from django.views.decorators.csrf import csrf_exempt
import os,errno
import sys
import urllib.request
from urllib.parse import quote
from urllib.request import Request, urlopen 
import json 
# Create your views here.
import base64
import pymysql 
from .models import DroneDataModels


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGE_DIRS=[
    os.path.join(BASE_DIR, 'image')
]

'''
    f"https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x={}&y={}"
        KakaoAK 876e9dd3cee1b67c2f15c6a58cd44f9c

'''

url = "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?"
KakaoAK = 'KakaoAK 876e9dd3cee1b67c2f15c6a58cd44f9c'


def index(request):
    return render(request, "index.html")

@csrf_exempt
def save(request):
    directory = ''
    if (request.method == 'POST'):
        id = request.POST.get('d_id')
        x = request.POST.get('x')
        y = request.POST.get('y')
        address = request.POST.get('add')
        print(id)
        img = request.POST.get('img')
        img = img.replace('data:image/png;base64,', '')
        img = img.replace(' ', '+')
        d = base64.b64decode(img)      
        now = time.localtime()
        directory = f'./image/{id}/{now.tm_year}_{now.tm_mon}_{now.tm_mday}/'
        print(id,x,y,address)
        try:
            os.makedirs(directory)
        except OSError as e:
            if e.errno != errno.EEXIST:
                raise
        d_name = f'p{now.tm_hour}_{now.tm_min}_{now.tm_sec}.png'
    
        data_to_database(id,directory,d_name,x,y,address)
        file = open(directory+d_name, mode="wb")        
        file.write(d)
        file.close()

        

    return HttpResponse("receive")


def data_to_database(d_id,img_path,img_name,x,y,address):
    conn = pymysql.connect(host='localhost', user='user01', password='1234',port=5306,
                       db='mydb', charset='utf8') 
    curs = conn.cursor()
    sql = """insert into common_dronedatamodels(d_id,img_path,img_name,x,y,address)
            values (%s, %s, %s, %s, %s, %s)"""
    curs.execute(sql,(d_id,img_path,img_name,x,y,address))
    conn.commit()    
    conn.close()
  