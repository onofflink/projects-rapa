from django.shortcuts import render
from django.http import HttpResponse
from common.models import DroneDataModels
from .forms import BoardForm
from django.utils import timezone 
from django.shortcuts import redirect 

# Create your views here.

def index(request):
    return HttpResponse("This is my board")

def list(request):
    #'templates/board/board_list.html'
    #장고프레임워크에서 제공한다. 모델객체에서 objects().all()
    #내부적으로 자동쿼리 생성 
    board_list = DroneDataModels.objects.all()
    return render(request, 'board/board_list.html',
     {'question_list':board_list} )

#/project/myhome/board/views.py 


def write(request):
    #폼객체를 만들어서 render 의 세번째 인자로 전달하자 
    form = BoardForm()
    return render(request, 'board/board_write.html', {'form':form})

#save  까지 
def save(request):
    form = BoardForm(request.POST) #POST 로 전송받는거만 처리하겠다 
    
    #디비에 저장하기 위해서 model 객체를 가져온다 
    board = form.save(commit=False) #반드시 - commit는 False 로  
    #True로 지정하면 바로 db로 저장되기 때문에 중간에, 저장은 막고 
    #모델 객체만 반환받으려면 commit 속성을 반드시 False로 해줘야 한다 
     #이 두 요소는 form 객체에 없었음 
    board.save() # 모델내의 save함수를 호출하여  db에 저장한다 
    return redirect('board:list')

#python manage.py createsuperuser 
from django.shortcuts import get_object_or_404
def view(request, id):
    #조회수 증가하기 
    #get_object_or_404 - 혹시나 id값을 안갖고 오거나 id값이 잘못 올경우에 에러처리 + 데이터 가져오는
    #것까지 처리를 한다 
    
    board_obj = get_object_or_404(DroneDataModels, pk=id) 
    board_obj.save()

    context = {'board':board_obj}
    return render(request, 'board/board_view.html', context)

def modify(request, id):
    #수정할 내용 받아와야 한다  - 디비에서 해당 데이터를 가져온다 get_object_or_404
    #조건은 id  -> select * from board_board where id=전달받은값 
    board_obj = get_object_or_404(DroneDataModels, pk=id) ####### 

    if request.method == "GET":
        context = {'board':board_obj}
        return render(request, 'board/board_write.html', context)
    else:
        #수정시에는 update 쿼리를 생성해야 한다. id값이 필요하다. 
        #그래서 instance 라는 매개변수에 디비로 부터 읽어온 값을 전달해야 한다 
        form = BoardForm(request.POST, instance=board_obj)

        board = form.save(commit=False)
        #board.hit = board.hit + 1 #조회수 하나 증가시키고 
        board.save() 

        return redirect('board:list')

def delete(request, id):
    board_obj = get_object_or_404(DroneDataModels, pk=id) ####### 
    board_obj.delete()
    return redirect('board:list')

    
