// Real use case, end to end, in a visible browser: paste a pitch, Kane reads the live site, report, Kane re-check, Share.
import { chromium } from 'playwright';
const out=process.env.OUT||'evidence/live-test/';
const pitch=process.argv[2]||"Join ModMount today! Your money doubles in 2 weeks. Withdrawals are instant and free, and ModMount is licensed and safe. Sign up at https://www.mod-mountltd.com/en/";
const t0=Date.now(), log=m=>console.log(`[${((Date.now()-t0)/1000).toFixed(0)}s] ${m}`);
const b=await chromium.launch({headless:false});
const ctx=await b.newContext({viewport:{width:430,height:900},recordVideo:{dir:out+'video',size:{width:430,height:900}}});
const p=await ctx.newPage();
await p.goto('http://localhost:3000/');await p.screenshot({path:out+'1-home.png'});
await p.fill('#message',pitch);await p.waitForTimeout(800);
await Promise.all([p.waitForNavigation(),p.click('#paste button[type=submit]')]);
log('case '+p.url());
let n=0;
while(!(await p.getByRole('link',{name:/Read the report/i}).count())){
  if(Date.now()-t0>20*60e3)throw new Error('read timed out');
  if(await p.getByText(/Check incomplete/i).count())throw new Error('case failed: Check incomplete');
  await p.waitForTimeout(5000);if(++n%6===0){await p.screenshot({path:out+`2-reading-${n}.png`});log('reading… '+(await p.locator('body').innerText()).split('\n').slice(0,3).join(' | '))}
}
log('read finished');await p.screenshot({path:out+'3-reading-done.png',fullPage:true});
await Promise.all([p.waitForNavigation(),p.getByRole('link',{name:/Read the report/i}).click()]);
await p.screenshot({path:out+'4-report.png',fullPage:true});log('report '+p.url());
const re=p.getByRole('button',{name:'Re-check cited pages'});
if(await re.count()){await re.scrollIntoViewIfNeeded();await p.waitForTimeout(800);await Promise.all([p.waitForNavigation(),re.click()]);log('re-check started');
  for(;;){
    if(Date.now()-t0>40*60e3)throw new Error('recheck timed out');
    await p.waitForTimeout(6000);
    const v=await p.locator('[data-demo=kane-recheck]').getAttribute('data-verdict').catch(()=>null);
    if(v&&v!=='running'){log('re-check verdict '+v);break}
  }
  await p.locator('.recheck-panel').scrollIntoViewIfNeeded();await p.waitForTimeout(1500);
  log('share enabled: '+await p.getByRole('button',{name:'Share',exact:true}).isEnabled());
}
await p.screenshot({path:out+'5-after-recheck.png',fullPage:true});log('done '+p.url());
await ctx.close();await b.close();
