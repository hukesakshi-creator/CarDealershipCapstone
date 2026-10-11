const { spawn } = require('child_process');
const http = require('http');
const port = 5127;
const child = spawn(process.execPath, ['server.js'], {env:{...process.env,PORT:String(port)},stdio:'ignore'});
const wait = ms => new Promise(r=>setTimeout(r,ms));
(async()=>{try{let response;for(let i=0;i<30;i++){await wait(250);try{response=await new Promise((resolve,reject)=>http.get(`http://127.0.0.1:${port}/api/dealers`,res=>{let data='';res.on('data',d=>data+=d);res.on('end',()=>resolve({status:res.statusCode,body:data}));}).on('error',reject));break;}catch(e){}}if(!response||response.status!==200)throw new Error('GET /api/dealers did not return 200');const data=JSON.parse(response.body);if(!Array.isArray(data)||data.length<1)throw new Error('Dealer list missing');console.log('Smoke test passed: GET /api/dealers returned dealer data.');process.exitCode=0;}catch(e){console.error(e.message);process.exitCode=1;}finally{child.kill();}})();
