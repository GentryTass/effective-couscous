import {decide,normalize,validDate} from './engine.mjs';
export function runChecks(data){
 const now=new Date('2026-10-07T12:00:00Z');
 const cases=[{name:'Calendar dates must exist',run:()=>!validDate('2026-02-31')&&!validDate('2026-13-01')&&!validDate('2026-2-01')&&validDate('2024-02-29')&&!validDate('2025-02-29')},
 {name:'Impossible source date blocks a match',run:()=>decide({...data,reviewedAt:'2026-09-31'},'5500-2','116130','US',now).status==='review'},
 {name:'Invalid current date blocks a match',run:()=>decide(data,'5500-2','116130','US',new Date('invalid')).status==='review'},
...data.sources.filter(s=>s.type==='Manufacturer product page').flatMap(s=>s.models.map(m=>({name:`Documented pair: ${m} / ${s.sku}`,run:()=>decide(data,m,s.sku,'US',now).status==='documented'}))),
 {name:'5500 and 5500-2 stay separate',run:()=>decide(data,'5500','116130','US',now).status==='unknown'&&decide(data,'5500-2','115115','US',now).status==='unknown'},
 {name:'Extra suffix stays unresolved',run:()=>decide(data,'5500-2-EU','116130','US',now).status==='unknown'},
 {name:'Unknown model stays unresolved',run:()=>decide(data,'A100','116130','US',now).status==='unknown'},
 {name:'Other region needs verification',run:()=>decide(data,'5500-2','116130','other',now).status==='unknown'},
 {name:'Blank input never creates a match',run:()=>decide(data,'','116130','US',now).status==='unknown'},
 {name:'Case and outer spaces normalize',run:()=>normalize(' am80 ')==='AM80'&&decide(data,' am80 ','116130','US',now).status==='documented'},
 {name:'Unknown SKU never creates a match',run:()=>decide(data,'5500-2','000000','US',now).status==='unknown'},
 {name:'Stale review requests verification (controlled date)',run:()=>decide(data,'5500-2','116130','US',new Date('2026-11-08')).status==='review'},
 {name:'Future review date blocks current certainty',run:()=>decide(data,'5500-2','116130','US',new Date('2026-10-06T12:00:00Z')).status==='review'},
 {name:'Conflicting source blocks recommendation (controlled fixture)',run:()=>decide({...data,sources:[...data.sources,{id:'FIXTURE',models:[],excludedModels:['5500-2'],sku:'116130'}]},'5500-2','116130','US',now).status==='conflict'},
 {name:'Old individual source dates request review',run:()=>decide({...data,sources:data.sources.map(s=>({...s,reviewedAt:'2020-01-01'}))},'5500-2','116130','US',now).status==='review'},
 {name:'Multiple positive SKUs request review without declaring conflict',run:()=>decide({...data,sources:[...data.sources,{id:'FIXTURE',models:['5500-2'],sku:'115115',reviewedAt:data.reviewedAt}]},'5500-2','116130','US',now).status==='review'},
 {name:'Every documented verdict includes a source',run:()=>data.sources.filter(s=>s.type==='Manufacturer product page').every(s=>s.models.every(m=>decide(data,m,s.sku,'US',now).sourceIds.length>0))},
 {name:'Manuals agree with product pages',run:()=>data.sources.filter(s=>s.type==='Manufacturer manual').every(s=>s.models.every(m=>data.sources.some(p=>p.type==='Manufacturer product page'&&p.sku===s.sku&&p.models.includes(m))))},
 {name:'Every source has a manufacturer URL and locator',run:()=>data.sources.every(s=>new URL(s.url).hostname==='www.winixamerica.com'&&s.locator&&s.access==='Read via web retrieval')}
 ];return cases.map(c=>{try{return{name:c.name,passed:!!c.run()}}catch(e){return{name:c.name,passed:false,error:e.message}}});
}
