const {chromium,devices}=require('playwright');
(async()=>{
const b=await chromium.launch();
const ctx=await b.newContext({...devices['iPhone 13'],colorScheme:'light'});const pg=await ctx.newPage();
const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
pg.on('dialog',d=>{errs.push('NATIVE DIALOG '+d.message());d.dismiss();});
await pg.goto(require('url').pathToFileURL(require('path').join(__dirname,'..','app','index.html')).href);
await pg.screenshot({path:require('path').join(require('os').tmpdir(),'gw-m0.png')});
await pg.tap('[data-lvl="1"]');
const sw=async l=>console.log(l,'scrollW',await pg.evaluate(()=>document.documentElement.scrollWidth));
await sw('today');await pg.screenshot({path:require('path').join(require('os').tmpdir(),'gw-m1.png'),fullPage:true});
for(const p of ['workouts','skills','library','progress']){await pg.tap(`#navBottom [data-go="${p}"]`);await sw(p);}
await pg.screenshot({path:require('path').join(require('os').tmpdir(),'gw-m2.png')});
await pg.tap('#navBottom [data-go="settings"]');await sw('settings');
// strength workout on phone
await pg.tap('#navBottom [data-go="today"]');await pg.evaluate(()=>startWorkout('strength'));
await pg.tap('#pSkip');await pg.screenshot({path:require('path').join(require('os').tmpdir(),'gw-m3.png')});
await pg.tap('#pGo');await pg.evaluate(()=>{P.left=0.01});await pg.waitForTimeout(400);
await pg.screenshot({path:require('path').join(require('os').tmpdir(),'gw-m4.png')});// rest
await pg.tap('#pSkip');await pg.screenshot({path:require('path').join(require('os').tmpdir(),'gw-m5.png')});// reps or next
// quit flow with in-page dialog: cancel then confirm
await pg.tap('#pQuit');await pg.tap('#askNo');console.log('still in player',!(await pg.$eval('#player',e=>e.classList.contains('hidden'))));
await pg.tap('#pQuit');await pg.tap('#askYes');await pg.waitForTimeout(200);await pg.screenshot({path:require('path').join(require('os').tmpdir(),'gw-m6.png')});
console.log('summary?',!!(await pg.$('.summary')));await pg.tap('#pClose');
// history delete
await pg.tap('#navBottom [data-go="progress"]');await pg.tap('[data-del]');await pg.tap('#askYes');console.log('hist after del',await pg.evaluate(()=>S.hist.length));
// backup code + restore
await pg.evaluate(()=>{S.hist.push({id:'x1',date:new Date().toISOString(),wid:'cars',name:'Daily Joint CARs',tag:'Mobility',dur:300,sets:6,reps:30,secs:45});save();});
await pg.tap('#navBottom [data-go="settings"]');await pg.tap('#exportBtn');const code=await pg.inputValue('#bkTxt');await pg.tap('[data-close]');
await pg.evaluate(()=>{S.hist=[];save();});
await pg.tap('#pasteBtn');await pg.fill('#rsTxt',code);await pg.tap('#rsGo');console.log('restored hist',await pg.evaluate(()=>S.hist.length));
// theme auto
await pg.evaluate(()=>{S.settings.theme='auto';applyTheme();});console.log('bg auto light',await pg.evaluate(()=>getComputedStyle(document.body).backgroundColor));
// reset
await pg.tap('#navBottom [data-go="settings"]');await pg.tap('#resetBtn');await pg.tap('#askYes');console.log('onboard shown',await pg.$eval('#onboard',e=>!e.classList.contains('hidden')));
// small phone
await pg.setViewportSize({width:360,height:640});await pg.tap('[data-lvl="0"]');await pg.evaluate(()=>startWorkout('upper'));await pg.tap('#pSkip');await pg.tap('#pGo');await pg.evaluate(()=>{P.left=0.01});await pg.waitForTimeout(400);await pg.tap('#pSkip');await pg.screenshot({path:require('path').join(require('os').tmpdir(),'gw-m7.png')});
console.log('ERR',errs);await b.close();})();
