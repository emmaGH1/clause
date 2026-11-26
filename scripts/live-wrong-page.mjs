// Point a report's lead claim at the homepage and let a fresh Kane run fail it (fail-closed demo).
import { chromium } from 'playwright';
const id=process.argv[2];const t0=Date.now(),log=m=>console.log(`[${((Date.now()-t0)/1000).toFixed(0)}s] ${m}`);
const b=await chromium.launch({headless:false});const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage();
await p.goto(`http://localhost:3000/case/${id}`);await p.waitForTimeout(1200);
const btn=p.getByRole('button',{name:/Point this claim at the homepage/i}).first();
await btn.scrollIntoViewIfNeeded();await Promise.all([p.waitForNavigation(),btn.click()]);log('wrong-page run started '+p.url());
for(;;){if(Date.now()-t0>20*60e3)throw new Error('timed out');await p.waitForTimeout(6000);
  const v=await p.locator('[data-demo=kane-recheck]').getAttribute('data-verdict').catch(()=>null);if(v&&v!=='running'){log('verdict '+v);break}}
log('share enabled: '+await p.getByRole('button',{name:'Share',exact:true}).isEnabled());await b.close();
