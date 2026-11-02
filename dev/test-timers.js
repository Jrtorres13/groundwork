const {chromium}=require('playwright');
(async()=>{
const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1200,height:860}});
const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('dialog',d=>d.accept());
await pg.goto(require('url').pathToFileURL(require('path').join(__dirname,'..','app','index.html')).href);
await pg.click('[data-lvl="0"]');
await pg.evaluate(()=>{S.lad.push.tgt=8;save();startWorkout('upper');});
// real timer check: prep should auto-advance after ~5s
await pg.waitForTimeout(5600);console.log('after prep:',await pg.textContent('.pname'));
// timed hold start, wait 2s, pause, check number decreased
await pg.click('#pGo');await pg.waitForTimeout(2100);const t1=await pg.textContent('.num');await pg.click('#pPause');await pg.waitForTimeout(1200);const t2=await pg.textContent('.num');console.log('hold',t1,t2,'(should match)');
await pg.click('#pGo');await pg.click('#pDoneEarly');console.log('rest?',await pg.textContent('.pname'));
await pg.click('#pBack');console.log('back to',await pg.textContent('.pname'));
let n=0;while(n++<200){if(await pg.$('#pClose'))break;for(const id of ['#pSkip','#pDone','#pGo']){const el=await pg.$(id);if(el){await el.click();if(id==='#pGo'){await pg.evaluate(()=>{P.left=0.01});await pg.waitForTimeout(350);}break;}}}
console.log(await pg.innerText('.summary .card:last-of-type'));
await pg.click('[data-lvup]');console.log('lvl',await pg.evaluate(()=>JSON.stringify(S.lad.push)));
await pg.keyboard.press('Escape');console.log('closed',await pg.$eval('#player',e=>e.classList.contains('hidden')));
console.log('ERR',errs);await b.close();})();
