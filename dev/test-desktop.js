const {chromium}=require('playwright');
(async()=>{
const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1200,height:860}});
const errs=[];pg.on('pageerror',e=>errs.push('PAGEERR '+e.message));pg.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE '+m.text())});
pg.on('dialog',d=>d.accept());
await pg.goto(require('url').pathToFileURL(require('path').join(__dirname,'..','app','index.html')).href);
await pg.click('[data-lvl="1"]');
for(const p of ['workouts','skills','library','progress','learn','settings','today']){await pg.click(`#navSide [data-go="${p}"]`);await pg.waitForTimeout(150);}
// library search + filter
await pg.click('#navSide [data-go="library"]');await pg.fill('#libSearch','hip');console.log('lib hip',await pg.$$eval('#libGrid .ex',x=>x.length));
await pg.click('[data-lc="fascia"]');await pg.fill('#libSearch','');console.log('fascia',await pg.$$eval('#libGrid .ex',x=>x.length));
await pg.click('#libGrid .ex');await pg.waitForTimeout(100);console.log('dlg',await pg.textContent('#dlgBody h2'));await pg.click('[data-close]');
// run strength workout: complete all sets
await pg.click('#navSide [data-go="today"]');
await pg.evaluate(()=>startWorkout('strength'));
let n=0;
while(n++<200){
  if(await pg.$('#pClose'))break;
  for(const id of ['#pSkip','#pDone','#pGo','#pDoneEarly']){const el=await pg.$(id);if(el){
    if(id==='#pGo'){await el.click();await pg.waitForTimeout(50);
      // fast-forward timed hold
      await pg.evaluate(()=>{P.left=0.01;});await pg.waitForTimeout(350);}
    else await el.click();
    break;}}
}
console.log('loops',n);
console.log('summary',await pg.innerText('.summary'));
const lv=await pg.$('[data-lvup]');console.log('lvup btn',!!lv);
await pg.click('#pClose');
console.log('hist',await pg.evaluate(()=>JSON.stringify(S.hist)));
console.log('lad',await pg.evaluate(()=>JSON.stringify(S.lad)));
// custom builder
await pg.click('#navSide [data-go="workouts"]');await pg.click('#newWorkout');
await pg.fill('#bName','Test Day');await pg.check('#bPick input[value="pushup"]');await pg.check('#bPick input[value="plank"]');
await pg.click('#bSave');console.log('custom cards',await pg.$$eval('#wGrid .wcard',x=>x.map(e=>e.querySelector('h3').textContent)));
// partial quit
await pg.evaluate(()=>startWorkout(S.custom[0].id));await pg.click('#pSkip');await pg.click('#pDone');await pg.click('#pQuit');await pg.click('#askYes');
console.log('partial summary',(await pg.innerText('.summary')).slice(0,80));await pg.click('#pClose');
// quit with nothing
await pg.evaluate(()=>startWorkout('cars'));await pg.click('#pQuit');await pg.click('#askYes');console.log('player hidden',await pg.$eval('#player',e=>e.classList.contains('hidden')));
// skills level up/down
await pg.click('#navSide [data-go="skills"]');await pg.click('[data-lv="push"][data-d="1"]');
await pg.click('#navSide [data-go="progress"]');console.log('hist rows',await pg.$$eval('#hist .hist',x=>x.length));
// reload persistence
await pg.reload();console.log('after reload hist',await pg.evaluate(()=>S.hist.length),'onboarded',await pg.evaluate(()=>S.onboarded));
// theme
await pg.click('#themeBtn');console.log('theme',await pg.evaluate(()=>document.documentElement.dataset.theme));await pg.click('#themeBtn');
// mobile
await pg.setViewportSize({width:390,height:844});await pg.click('#navBottom [data-go="today"]');
const ow=await pg.evaluate(()=>document.documentElement.scrollWidth);console.log('mobile scrollWidth',ow);
console.log('ERRORS',errs);
await b.close();})();
