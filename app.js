const order=Object.keys(S);let current='start';let sid='';
let audioCtx=null, airSource=null, airGain=null, airFilter=null, airOn=false;
function ensureAir(){
  if(audioCtx)return;
  audioCtx=new (window.AudioContext||window.webkitAudioContext)();
  const seconds=12, n=audioCtx.sampleRate*seconds, buffer=audioCtx.createBuffer(1,n,audioCtx.sampleRate);
  const data=buffer.getChannelData(0);
  // Brown-ish noise: soft, non-tonal, no bass hum and no audible loop gap.
  let last=0;
  for(let i=0;i<n;i++){const white=Math.random()*2-1; last=(last+0.018*white)/1.018; data[i]=last*3.0;}
  airSource=audioCtx.createBufferSource(); airSource.buffer=buffer; airSource.loop=true;
  airFilter=audioCtx.createBiquadFilter(); airFilter.type='lowpass'; airFilter.frequency.value=1500; airFilter.Q.value=.15;
  airGain=audioCtx.createGain(); airGain.gain.value=0;
  airSource.connect(airFilter).connect(airGain).connect(audioCtx.destination); airSource.start();
}

function uuid(){return crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2)}
function eventName(screen,label){const map={start:'session_started',control:'reached_control',safetyStop:'safety_exit',final:'completed'};if(screen==='clarity'){if(label==='Да')return'clarity_yes';if(label==='Частично')return'clarity_partial';if(label==='Нет')return'clarity_no'}return map[screen]||('screen_'+screen)}
function track(name){if(!name)return;try{let a=JSON.parse(localStorage.getItem('anon_events')||'[]');a.push({event:name,ts:new Date().toISOString(),sid,version:'3.1'});localStorage.setItem('anon_events',JSON.stringify(a.slice(-500)))}catch(e){};const c=window.APP_CONFIG&&APP_CONFIG.goatcounterCode;if(c){const u='https://'+c+'.goatcounter.com/count?p='+encodeURIComponent('/event/'+name)+'&t='+encodeURIComponent(name)+'&e=1';fetch(u,{mode:'no-cors',keepalive:true}).catch(()=>{})}}
function accept(){localStorage.setItem('consent_v','3.1');localStorage.setItem('consent_at',new Date().toISOString());go('start')}
function go(id,label=''){if(id==='worksheet'){window.open('worksheet-v3.pdf','_blank');track('worksheet_opened');return}if(id==='finishSafety'){fadeOut();track('safety_session_ended');current='start';render();return}if(id==='finish'){fadeOut();track('session_completed');current='start';render();return}if(id==='start'){sid=uuid()}current=id;if(id==='start')track('session_started');if(id==='safetyStop')track('safety_exit');if(id==='control')track('reached_control');render();scrollTo(0,0)}
function choose(label,id){if(current==='clarity'){track(label==='Да'?'clarity_yes':label==='Частично'?'clarity_partial':'clarity_no')}go(id,label)}
function render(){const s=S[current];document.getElementById('app').innerHTML=`<h1>${s[0]}</h1>${s[1]}<div class="buttons">${s[2].map(b=>`<button class="${b[2]||''}" onclick="${b[1]==='accept'?'accept()':`choose('${b[0].replaceAll("'","\\'")}','${b[1]}')`}">${b[0]}</button>`).join('')}</div>`;const idx=Math.max(0,order.indexOf(current));document.getElementById('bar').style.width=Math.min(100,Math.round(idx/order.length*100))+'%';document.getElementById('restart').style.visibility=current==='consent'?'hidden':'visible'}
function toggleAudio(){
  ensureAir();
  if(audioCtx.state==='suspended')audioCtx.resume();
  const now=audioCtx.currentTime;
  airGain.gain.cancelScheduledValues(now);
  if(!airOn){
    airGain.gain.setValueAtTime(airGain.gain.value,now);
    airGain.gain.linearRampToValueAtTime(0.035,now+2.5);
    airOn=true; document.getElementById('audioBtn').textContent='♪ Фон: вкл.';
    track('ambient_on');
  }else{
    airGain.gain.setValueAtTime(airGain.gain.value,now);
    airGain.gain.linearRampToValueAtTime(0,now+1.5);
    airOn=false; document.getElementById('audioBtn').textContent='♪ Фон: выкл.';
    track('ambient_off');
  }
}
function fadeOut(){
  if(!audioCtx||!airOn)return;
  const now=audioCtx.currentTime;
  airGain.gain.cancelScheduledValues(now);
  airGain.gain.setValueAtTime(airGain.gain.value,now);
  airGain.gain.linearRampToValueAtTime(0,now+2);
  airOn=false; document.getElementById('audioBtn').textContent='♪ Фон: выкл.';
}
if(!localStorage.getItem('consent_v'))current='consent';else{current='start';sid=uuid()}render();
