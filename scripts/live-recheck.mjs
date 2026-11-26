// Open a finished case's report and run Kane's re-check for real, in a visible browser.
import { chromium } from 'playwright';
const id=process.argv[2];const out=process.env.OUT||'evidence/live-test/';
const t0=Date.now(),log=m=>console.log(`[${((Date.now()-t0)/1000).toFixed(0)}s] ${m}`);
const b=await chromium.launch({headless:false});
const ctx=await b.newContext({viewport:{width:1280,height:860},recordVideo:{dir:out+'video-recheck',size:{width:1280,height:860}}});
const p=await ctx.newPage();
await p.goto(`${process.env.BASE||'http://localhost:3000'}/case/${id}`);await p.waitForTimeout(1500);
const re=p.getByRole('button',{name:'Re-check cited pages'});
if(!(await re.count()))throw new Error('no re-check button');
await re.scrollIntoViewIfNeeded();await p.waitForTimeout(800);
await Promise.all([p.waitForNavigation(),re.click()]);log('re-check started');
for(;;){
  if(Date.now()-t0>25*60e3)throw new Error('timed out');
  await p.waitForTimeout(6000);
  const h=await p.locator('[data-demo=kane-recheck]').getAttribute('data-verdict').catch(()=>null);
  if(h&&h!=='running'){log('verdict '+h);break}
  if((Date.now()-t0)%30000<6000)log('re-checking…');
}
await p.locator('.recheck-panel').scrollIntoViewIfNeeded();await p.waitForTimeout(1500);
await p.screenshot({path:out+'6-recheck-done.png',fullPage:true});
log('share enabled: '+await p.getByRole('button',{name:'Share',exact:true}).isEnabled());
await ctx.close();await b.close();
