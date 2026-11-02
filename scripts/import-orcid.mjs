import fs from 'node:fs/promises';
import path from 'node:path';
const orcid='0000-0003-1148-0364';
const dest=path.resolve('src/content/publications');
const base='https://pub.orcid.org/v3.0/'+orcid;
async function readJSON(endpoint) {
  const response=await fetch(base+endpoint,{headers:{Accept:'application/json','User-Agent':'LinyangSun-Academic-Portfolio/1.0'},signal:AbortSignal.timeout(25000)});
  if (!response.ok) throw Error('ORCID returned HTTP '+response.status+' for '+endpoint);
  return response.json();
}
const val=(x)=>x?.value?.trim()||'';
const clean=(x)=>String(x||'').replace(/<[^>]+>/g,'').trim();
const date=(w)=>{
  const d=w?.['publication-date'];
  const y=val(d?.year),m=val(d?.month)||'01',day=val(d?.day)||'01';
  return /^\d{4}$/.test(y)?y+'-'+m.padStart(2,'0')+'-'+day.padStart(2,'0'):'';
};
const doi=(w)=>{
  for (const id of w?.['external-ids']?.['external-id']||[]) {
    if (id['external-id-type']?.toLowerCase()!=='doi') continue;
    const s=String(id['external-id-value']||id['external-id-url']?.value||'').trim()
      .replace(/^https?:\/\/(?:dx\.)?doi\.org\//i,'').replace(/^doi:\s*/i,'');
    if (/^10\.\d{4,9}\/\S+$/i.test(s)) return s;
  }
  return '';
};
const slug=(s)=>clean(s).normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'').slice(0,100);
const listing=await readJSON('/works');
if (!Array.isArray(listing.group)||!listing.group.length) throw Error('ORCID returned no public works: existing publications were not changed.');
const output=[],taken=new Set();
for (const group of listing.group) {
  const summaries=(group['work-summary']||[]).filter(x=>clean(val(x.title?.title)));
  if (!summaries.length) continue;
  const rank=(x)=>(doi(x)?100:0)+(x.type==='journal-article'?20:0)+(date(x)?5:0);
  summaries.sort((a,b)=>rank(b)-rank(a));
  const summary=summaries[0];
  let record=summary;
  if (summary['put-code']) {
    try {record=await readJSON('/work/'+summary['put-code']);}
    catch(error) {console.warn('Detail unavailable: '+error.message);}
  }
  const title=clean(val(record.title?.title)||val(summary.title?.title));
  if (!title) continue;
  const dateValue=date(record)||date(summary),doiValue=doi(record)||doi(summary);
  const year=Number(dateValue.slice(0,4));
  if (!Number.isInteger(year) || year < 2026) continue;
  const type=(record.type||summary.type||'other').toLowerCase();
  // Only journal articles and preprints belong in this selected-publications section.
  if (type !== 'journal-article' && type !== 'preprint') continue;
  const typeLabel=type === 'preprint' ? 'Preprint' : 'Peer-reviewed';
  const journal=clean(val(record['journal-title'])||val(summary['journal-title']));
  const author=(record.contributors?.contributor||[]).map(x=>val(x['credit-name'])).filter(Boolean).join(', ');
  const source=val(record.url)||val(summary.url);
  const url=doiValue?'https://doi.org/'+doiValue:(/^https?:\/\//i.test(source)?source:'https://orcid.org/'+orcid);
  const filename=(slug(doiValue||dateValue+'-'+title)||'orcid-'+summary['put-code'])+'.md';
  if (taken.has(filename)) continue;
  taken.add(filename);
  const matter=[
    '---',
    'title: '+JSON.stringify(title),
    ...(author?['author: '+JSON.stringify(author)]:[]),
    ...(dateValue?['date: '+JSON.stringify(dateValue)]:[]),
    ...(journal?['journal: '+JSON.stringify(journal)]:[]),
    'external_url: '+JSON.stringify(url),
    'description: '+JSON.stringify(journal?typeLabel+' · '+journal:typeLabel),
    'tags: ['+JSON.stringify(typeLabel)+']',
    '---','',
    ...(doiValue?['**DOI:** ['+doiValue+'](https://doi.org/'+doiValue+')','']:[]),
    '[View original record]('+url+')',''
  ];
  output.push({filename,title,date:dateValue,journal,doi:doiValue,type,authors:author||'',content:matter.join('\n')});
}
if (!output.length) throw Error('ORCID works contained no titles: existing publications were not changed.');
console.log('ORCID_IMPORTED_WORKS:',JSON.stringify(output.map(({content,...rest})=>rest)));
await fs.mkdir(dest,{recursive:true});
for (const w of output) await fs.writeFile(path.join(dest,w.filename),w.content);
for (const example of ['math-theory-communication.md','noise.md']) await fs.rm(path.join(dest,example),{force:true});
console.log('Imported '+output.length+' works from ORCID '+orcid);
