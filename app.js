const order=Object.keys(S);let current='start';let sid='';
const ambient=document.getElementById('ambient');
let audioOn=false, fadeTimer=null;
ambient.volume=0;
function uuid(){return crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2)}
function eventName(screen,label){const map={start:'session_started',control:'reached_control',safetyStop:'safety_exit',final:'completed'};if(screen==='clarity'){if(label==='Да')return'clarity_yes';if(label==='Частично')return'clarity_partial';if(label==='Нет')return'clarity_no'}return map[screen]||('screen_'+screen)}
function track(name){if(!name)return;try{let a=JSON.parse(localStorage.getItem('anon_events')||'[]');a.push({event:name,ts:new Date().toISOString(),sid,version:'3.6'});localStorage.setItem('anon_events',JSON.stringify(a.slice(-500)))}catch(e){};const c=window.APP_CONFIG&&APP_CONFIG.goatcounterCode;if(c){const u='https://'+c+'.goatcounter.com/count?p='+encodeURIComponent('/event/'+name)+'&t='+encodeURIComponent(name)+'&e=1';fetch(u,{mode:'no-cors',keepalive:true}).catch(()=>{})}}
function accept(){localStorage.setItem('consent_v','3.6');localStorage.setItem('consent_at',new Date().toISOString());go('start')}
async function shareApp(){
  track('share_clicked');
  const data={title:'От тревоги — к ясности',text:'5–10 минут, чтобы спокойно разобраться в тревожащей ситуации.',url:location.href.split('#')[0]};
  if(navigator.share){try{await navigator.share(data)}catch(e){}}
  else{try{await navigator.clipboard.writeText(data.url);alert('Ссылка скопирована.')}catch(e){}}
}
function go(id,label=''){if(id==='share'){shareApp();return}if(id==='worksheet'){window.open('worksheet-v3.pdf','_blank');track('worksheet_opened');return}if(id==='finishSafety'){fadeOut();track('safety_session_ended');current='start';render();return}if(id==='finish'){fadeOut();track('session_completed');current='start';render();return}if(id==='start'){sid=uuid()}current=id;if(id==='start')track('session_started');if(id==='safetyStop')track('safety_exit');if(id==='control')track('reached_control');render();scrollTo(0,0)}
function choose(label,id){if(current==='clarity'){track(label==='Да'?'clarity_yes':label==='Частично'?'clarity_partial':'clarity_no')}go(id,label)}
function render(){const s=S[current];document.getElementById('app').innerHTML=`<h1>${s[0]}</h1>${s[1]}<div class="buttons">${s[2].map(b=>`<button class="${b[2]||''}" onclick="${b[1]==='accept'?'accept()':`choose('${b[0].replaceAll("'","\\'")}','${b[1]}')`}">${b[0]}</button>`).join('')}</div>`;const idx=Math.max(0,order.indexOf(current));document.getElementById('bar').style.width=Math.min(100,Math.round(idx/order.length*100))+'%';document.getElementById('restart').style.visibility=current==='consent'?'hidden':'visible'}
function setAudioLabel(){document.getElementById('audioBtn').textContent=audioOn?'♪ Фон: вкл.':'♪ Фон: выкл.'}
function rampVolume(target,durationMs,onDone){
  if(fadeTimer)clearInterval(fadeTimer);
  const start=ambient.volume, steps=30, stepMs=Math.max(20,Math.round(durationMs/steps));
  let i=0;
  fadeTimer=setInterval(()=>{i++; ambient.volume=start+(target-start)*(i/steps);
    if(i>=steps){clearInterval(fadeTimer);fadeTimer=null;ambient.volume=target;if(onDone)onDone();}
  },stepMs);
}
function toggleAudio(){
  if(!audioOn){
    ambient.play().then(()=>{audioOn=true;setAudioLabel();rampVolume(0.16,2200);track('ambient_on')}).catch(()=>{});
  }else{
    audioOn=false;setAudioLabel();rampVolume(0,1200,()=>ambient.pause());track('ambient_off');
  }
}
function fadeOut(){
  if(!audioOn)return;
  audioOn=false;setAudioLabel();rampVolume(0,1800,()=>{ambient.pause();ambient.currentTime=0;});
}
ambient.addEventListener('ended',()=>{
  // Main track is ~7 minutes. If a session lasts longer, restart softly.
  if(audioOn){ambient.currentTime=0;ambient.volume=0;ambient.play().then(()=>rampVolume(0.16,1800)).catch(()=>{});}
});
if(!localStorage.getItem('consent_v'))current='consent';else{current='start';sid=uuid()}render();
