const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
app.use(cors()); app.use(express.json());
const PORT = process.env.PORT || 5000;
const dealers = [
 {id:1,full_name:'Sunrise Auto Mall',city:'Wichita',state:'Kansas',address:'1200 Central Ave, Wichita, KS',phone:'316-555-0101',reviews:[{id:101,name:'Alex Morgan',purchase:'Sedan',review:'Fantastic services',rating:5}]},
 {id:2,full_name:'Prairie Motors',city:'Topeka',state:'Kansas',address:'88 Kansas Ave, Topeka, KS',phone:'785-555-0102',reviews:[{id:102,name:'Jamie Lee',purchase:'SUV',review:'Friendly team and great support',rating:5}]},
 {id:3,full_name:'Metro Car House',city:'Pune',state:'Maharashtra',address:'Baner Road, Pune',phone:'+91-20-5550-0103',reviews:[]}
];
const makes = [{id:1,name:'Toyota'},{id:2,name:'Honda'},{id:3,name:'Ford'},{id:4,name:'Hyundai'}];
const models = [{id:1,make_id:1,name:'Camry'},{id:2,make_id:1,name:'Corolla'},{id:3,make_id:2,name:'Civic'},{id:4,make_id:3,name:'Mustang'},{id:5,make_id:4,name:'Creta'}];
app.get('/',(req,res)=>res.json({message:'Car Dealership API is running',endpoints:['/api/dealers','/api/car-makes','/api/car-models']}));
app.get('/api/dealers',(req,res)=>res.json(dealers));
app.get('/api/dealers/state/:state',(req,res)=>res.json(dealers.filter(d=>d.state.toLowerCase()===req.params.state.toLowerCase())));
app.get('/api/dealers/:id/reviews',(req,res)=>{const d=dealers.find(x=>x.id===Number(req.params.id)); if(!d)return res.status(404).json({error:'Dealer not found'});res.json(d.reviews)});
app.get('/api/dealers/:id',(req,res)=>{const d=dealers.find(x=>x.id===Number(req.params.id)); if(!d)return res.status(404).json({error:'Dealer not found'});res.json(d)});
app.get('/api/car-makes',(req,res)=>res.json(makes));
app.get('/api/car-models',(req,res)=>res.json(models));
app.post('/api/login',(req,res)=>{const {username,password}=req.body||{};if(username==='root'&&password==='root123')return res.json({message:'Login successful',username,token:'local-demo-token'});return res.status(401).json({error:'Invalid username or password'});});
app.post('/api/logout',(req,res)=>res.json({message:'Logout successful',username:(req.body||{}).username||'root'}));
app.post('/api/analyze-review',(req,res)=>{const review=String((req.body||{}).review||'');const words=new Set(review.toLowerCase().split(/\W+/));const pos=['fantastic','great','good','excellent','amazing','helpful','friendly','wonderful','best','love','satisfied','fast'];const neg=['bad','poor','terrible','awful','worst','rude','slow','hate','broken','disappointed'];let score=pos.filter(w=>words.has(w)).length-neg.filter(w=>words.has(w)).length;res.json({review,sentiment:score>0?'positive':score<0?'negative':'neutral',score});});
app.post('/api/dealers/:id/reviews',(req,res)=>{const d=dealers.find(x=>x.id===Number(req.params.id));if(!d)return res.status(404).json({error:'Dealer not found'});const {name='Guest',purchase='General',review=''}=req.body||{};if(!review.trim())return res.status(400).json({error:'Review is required'});const item={id:Date.now(),name,purchase,review,rating:5};d.reviews.push(item);res.status(201).json(item);});
if(process.env.MONGODB_URI){mongoose.connect(process.env.MONGODB_URI).then(()=>console.log('MongoDB connected')).catch(err=>console.error('MongoDB connection failed:',err.message));}
app.listen(PORT,()=>console.log(`Express API listening on http://localhost:${PORT}`));
