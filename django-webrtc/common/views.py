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
        print(id)
        img = request.POST.get('img')
        img = img.replace('data:image/png;base64,', '')
        img = img.replace(' ', '+')
        d = base64.b64decode(img)      
        now = time.localtime()
        directory = f'./image/{id}/{now.tm_year}_{now.tm_mon}_{now.tm_mday}/'
        print(directory)
        try:
            os.makedirs(directory)
        except OSError as e:
            if e.errno != errno.EEXIST:
                raise
        file = open(directory+f'p{now.tm_hour}_{now.tm_min}_{now.tm_sec}.png', mode="wb")        
        file.write(d)
        file.close()
       
    return HttpResponse("receive")


def kakao_to_database(url,x,y):
    te = quote(f"x={x}&y={y}")
    request = Request(url+te)
    request.add_header("Authorization",KakaoAK)
    response = urlopen(request)
    rescode = response.getcode()
    print(rescode)

    #rescode 가 200일때 
    if(rescode==200):

        #파일 읽기 - json 형태의 데이터를 받아온다 
        response_body = response.read()
        #디코딩, utf-8로 디코딩 해야 한다 
        data = response_body.decode('utf-8')
        #json 데이터 파싱하기 , beautifulsoup -html,xml 파싱, 
        data2 = json.loads(data)
        documents = data2['documents'][0]
        print(documents['address'])             
        return (documents['address'])

    else:
        return None