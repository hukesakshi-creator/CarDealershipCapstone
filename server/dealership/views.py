import json
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponseBadRequest
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.views.decorators.http import require_http_methods
from .models import Review

DEALERS = [
 {'id':1,'full_name':'Sunrise Auto Mall','city':'Wichita','state':'Kansas','address':'1200 Central Ave, Wichita, KS','phone':'316-555-0101','website':'https://example.com/sunrise','image':'https://images.unsplash.com/photo-1562519819-016930ada31b?auto=format&fit=crop&w=1000&q=80'},
 {'id':2,'full_name':'Prairie Motors','city':'Topeka','state':'Kansas','address':'88 Kansas Ave, Topeka, KS','phone':'785-555-0102','website':'https://example.com/prairie','image':'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80'},
 {'id':3,'full_name':'Metro Car House','city':'Pune','state':'Maharashtra','address':'Baner Road, Pune','phone':'+91-20-5550-0103','website':'https://example.com/metro','image':'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=80'},
]
def home(request): return render(request, 'dealership/home.html', {'dealers':DEALERS})
def about(request): return render(request, 'dealership/about.html')
def contact(request): return render(request, 'dealership/contact.html')
def login_view(request):
    if request.method == 'POST':
        username=request.POST.get('username','').strip(); password=request.POST.get('password','')
        user=authenticate(request, username=username, password=password)
        if user:
            login(request,user); messages.success(request,'You are now logged in.'); return redirect('home')
        messages.error(request,'Invalid username or password.')
    return render(request,'dealership/login.html')
def logout_view(request):
    logout(request); messages.info(request,'You have been logged out.'); return redirect('home')
def register(request):
    if request.method == 'POST':
        username=request.POST.get('username','').strip(); email=request.POST.get('email','').strip(); password=request.POST.get('password','')
        if not username or not email or not password: messages.error(request,'All fields are required.')
        elif User.objects.filter(username=username).exists(): messages.error(request,'Username already exists.')
        else:
            User.objects.create_user(username=username,email=email,password=password,first_name=request.POST.get('first_name',''),last_name=request.POST.get('last_name',''))
            messages.success(request,'Registration successful. Please log in.'); return redirect('login')
    return render(request,'dealership/register.html')
def dealers_json(request): return JsonResponse({'dealers':DEALERS})
def dealers_by_state(request,state):
    matches=[d for d in DEALERS if d['state'].lower()==state.lower()]
    if request.headers.get('Accept','').startswith('application/json'): return JsonResponse({'dealers':matches,'state':state})
    return render(request,'dealership/home.html',{'dealers':matches,'filtered_state':state})
def dealer_detail(request,dealer_id):
    dealer=next((d for d in DEALERS if d['id']==dealer_id),None)
    if dealer is None: return render(request,'dealership/not_found.html',status=404)
    reviews=Review.objects.filter(dealer_id=dealer_id).order_by('-created_at')
    return render(request,'dealership/dealer_detail.html',{'dealer':dealer,'reviews':reviews})
def add_review(request,dealer_id):
    dealer=next((d for d in DEALERS if d['id']==dealer_id),None)
    if not dealer: return render(request,'dealership/not_found.html',status=404)
    if request.method=='POST':
        if not request.user.is_authenticated: return redirect('login')
        review=request.POST.get('review','').strip()
        if not review: messages.error(request,'Please enter a review.')
        else:
            Review.objects.create(dealer_id=dealer_id,username=request.user.username,purchase=request.POST.get('purchase','General'),review=review)
            messages.success(request,'Your review has been posted.'); return redirect('dealer_detail',dealer_id=dealer_id)
    return render(request,'dealership/add_review.html',{'dealer':dealer})
@require_http_methods(['POST'])
def analyze_review(request):
    try: payload=json.loads(request.body or '{}')
    except json.JSONDecodeError: return HttpResponseBadRequest('Invalid JSON')
    text=payload.get('review','')
    positive={'fantastic','great','good','excellent','amazing','helpful','friendly','wonderful','best','love','satisfied','fast'}
    negative={'bad','poor','terrible','awful','worst','rude','slow','hate','broken','disappointed'}
    words={w.strip('.,!?').lower() for w in text.split()}
    score=len(words & positive)-len(words & negative)
    sentiment='positive' if score>0 else ('negative' if score<0 else 'neutral')
    return JsonResponse({'review':text,'sentiment':sentiment,'score':score})
