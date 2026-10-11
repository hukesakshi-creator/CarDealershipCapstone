from django.contrib import admin
from django.urls import path
from dealership import views
urlpatterns = [
 path('admin/', admin.site.urls), path('', views.home, name='home'),
 path('about/', views.about, name='about'), path('contact/', views.contact, name='contact'),
 path('login/', views.login_view, name='login'), path('logout/', views.logout_view, name='logout'),
 path('register/', views.register, name='register'), path('dealers/', views.dealers_json, name='dealers_json'),
 path('dealers/state/<str:state>/', views.dealers_by_state, name='dealers_by_state'),
 path('dealer/<int:dealer_id>/', views.dealer_detail, name='dealer_detail'),
 path('dealer/<int:dealer_id>/review/', views.add_review, name='add_review'),
 path('analyze-review/', views.analyze_review, name='analyze_review'),
]
