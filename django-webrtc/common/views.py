from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
# Create your views here.
import base64

def index(request):
    return render(request, "index.html")

@csrf_exempt ''' to remove error for csrf '''
def save(request):
    if (request.method == 'POST'):
        id = request.POST.get('id')
        pwd = request.POST.get('pwd')
        img = request.POST.get('img')
        img = img.replace('data:image/png;base64,', '');
        img = img.replace(' ', '+')
        d = base64.b64decode(img)
        file = open('test1.png', mode="wb")
        file.write(d)
        file.close()
        print(img)
        print(id)
        print(pwd)
    return HttpResponse("receive")