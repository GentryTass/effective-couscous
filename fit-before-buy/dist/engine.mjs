export const normalize = value => String(value ?? '').trim().toUpperCase();
export function validDate(value) {
  if(typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date=new Date(value+'T00:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0,10)===value;
}
export function decide(data, model, sku, region='US', now=new Date()) {
  const exact=normalize(model), selected=data.products.find(p=>p.sku===sku);
  const base={model:exact,sku,region,reviewedAt:data.reviewedAt,sourceIds:[],status:'unknown',title:'Not yet verified',detail:'No exact-model match in this reviewed dataset. Absence is not proof of incompatibility.'};
  if(!exact) return {...base,title:'Enter the full model number',detail:'Find the model on the appliance label. Keep every suffix.'};
  if(!selected) return {...base,detail:'This filter is outside the reviewed dataset.'};
  if(region!=='US')return {...base,title:'Region needs verification',detail:'These sources are from Winix America. A match here does not confirm another regional variant.'};
  const all=data.sources.filter(s=>s.models.includes(exact));
  const matching=all.filter(s=>s.sku===sku);
  const exclusions=data.sources.filter(s=>s.sku===sku && (s.excludedModels??[]).includes(exact));
  if(!matching.length) {
    const other=[...new Set(all.map(s=>s.sku))];
    return {...base,sourceIds:all.map(s=>s.id),alternateSkus:other,detail:other.length?`Reviewed manufacturer evidence identifies ${other.join(' / ')} for ${exact}. The selected filter has no documented match here; that alone does not establish incompatibility.`:base.detail};
  }
  if(exclusions.length)return {...base,sourceIds:[...matching,...exclusions].map(s=>s.id),status:'conflict',title:'Conflicting evidence',detail:'The sources include both a match and an explicit exclusion. Resolve applicability and revisions before recommending purchase.'};
  if(all.some(s=>s.sku!==sku))return {...base,sourceIds:all.map(s=>s.id),status:'review',title:'Multiple filter records need review',detail:'More than one filter SKU is recorded for this model. This may reflect compatible alternatives, not a contradiction. Review the manufacturer records before recommending a filter.'};
  if(!(now instanceof Date) || !Number.isFinite(now.getTime())) return {...base,sourceIds:matching.map(s=>s.id),status:'review',title:'Check date unavailable',detail:'A valid current date is required before recommending a filter.'};
  const today=now.toISOString().slice(0,10);
  const needsReview=[data.reviewedAt,...matching.map(s=>s.reviewedAt)].some(date=>{ const age=(new Date(today+'T00:00:00Z')-new Date(date+'T00:00:00Z'))/86400000; return !validDate(date)||!Number.isFinite(age)||age<0||age>30; });
  if(needsReview)return {...base,sourceIds:matching.map(s=>s.id),status:'review',title:'Source review due',detail:'An exact match was recorded, but its review date needs checking. Reopen the sources before using this as a current recommendation.'};
  return {...base,sourceIds:matching.map(s=>s.id),status:'documented',title:'Documented manufacturer match',detail:`Winix documentation identifies ${selected.name} (${sku}) for model ${exact}. This is a documented compatibility statement, not a physical fit test or a filtration-performance assessment.`};
}
export function audit(data,result) {
  return {project:'Fit Before Buy',schemaVersion:2,generatedAt:new Date().toISOString(),...result,scope:data.scope,sources:data.sources.filter(s=>result.sourceIds.includes(s.id)),customerReply: result.status==='documented'?`For your US-market Winix model ${result.model}, manufacturer documentation reviewed on ${result.reviewedAt} identifies ${result.sku}. Check that the model label and genuine filter SKU match before ordering.`:`We have not verified the selected filter for your exact model and region. Please confirm the full model number and check the applicable manufacturer documentation before ordering.`,limitations:['Reviewed source snapshot; no live manufacturer connection.','No physical fit test, aftermarket equivalence or performance certification.','No sales, return or demand results measured.']};
}
