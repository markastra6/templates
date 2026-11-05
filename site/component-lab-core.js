import { PRESETS, buildCSS, validateTheme } from "./ui-tokens.js";
import { escapeHTML } from "./page-composer-core.js";

/** Original repository-owned examples. Never import or execute indexed third-party code. */
export const TYPES = Object.freeze(["button","tabs","accordion","form","toast","metric"]);
const EXAMPLES = Object.freeze({
  button: {title:"Interactive action",body:"A toggleable action with accessible state feedback.",action:"Activate"},
  tabs: {title:"Workspace tabs",body:"Explore panels using arrow keys, Home and End, or a pointer.",action:""},
  accordion: {title:"Questions and answers",body:"Native disclosure controls with keyboard support.",action:""},
  form: {title:"Email validation",body:"Test email validation locally. Your data is never transmitted.",action:"Check email"},
  toast: {title:"Status notification",body:"Display and dismiss an accessible status message.",action:"Show notification"},
  metric: {title:"Summary metric",body:"Demonstration values, not live analytics.",action:""}
});
export function defaultLab(type="button",theme=PRESETS.forest) {
  if (!Object.hasOwn(EXAMPLES,type)) throw new Error("Invalid component type");
  return {version:1,type,...EXAMPLES[type],theme:validateTheme(theme)};
}
export function validateLab(input) {
  if (!input || input.version !== 1 || !Object.hasOwn(EXAMPLES,input.type)) throw new Error("Invalid component schema");

  for (const [key,max] of Object.entries({title:90,body:240,action:40})) {
    if (typeof input[key] !== "string" || input[key].length>max ||
        (key==="title" && !input[key].trim())) throw new Error("Invalid field: "+key);
  }
  return {version:1,type:input.type,title:input.title,body:input.body,action:input.action,theme:validateTheme(input.theme)};
}
export const STYLES = String.raw`
*{box-sizing:border-box}body{margin:0;padding:clamp(12px,4vw,36px);background:var(--ui-canvas);color:var(--ui-text);font:400 1rem/1.55 var(--ui-font)}
.sample{max-width:850px;margin:auto;padding:clamp(18px,5vw,44px);background:var(--ui-surface);border:1px solid var(--ui-border);border-radius:calc(var(--ui-radius) + 8px);box-shadow:0 16px 42px #0000000a}
.eyebrow{margin:0 0 10px;text-transform:uppercase;font-size:.72rem;letter-spacing:.14em;font-weight:750;color:var(--ui-muted)}
h1{font-size:clamp(1.5rem,4vw,2.7rem);letter-spacing:-.045em;line-height:1.12;margin:0 0 14px}.intro{color:var(--ui-muted);margin:0 0 calc(1.75*var(--ui-density))}
.demo{display:grid;gap:var(--ui-density)}button,input{font:inherit}button{cursor:pointer}button:focus-visible,input:focus-visible,summary:focus-visible,[role="tabpanel"]:focus-visible{outline:3px solid var(--ui-accent);outline-offset:3px}
.primary{background:var(--ui-accent);color:var(--ui-on-accent);border:1px solid transparent;border-radius:var(--ui-radius);padding:calc(.8*var(--ui-density)) calc(1.3*var(--ui-density));font-weight:700;width:fit-content}
.primary[aria-pressed="true"]{box-shadow:0 0 0 4px var(--ui-border)}.secondary{border:1px solid var(--ui-border);background:var(--ui-surface);color:var(--ui-text);padding:.5rem 1rem;border-radius:var(--ui-radius)}
.status{color:var(--ui-muted);min-height:1.6em;margin:.3rem 0}.tabs{display:flex;flex-wrap:wrap;gap:.3rem;border-bottom:1px solid var(--ui-border)}
.tabs [role=tab]{border:0;border-bottom:3px solid transparent;background:transparent;color:var(--ui-muted);font-weight:700;padding:.75rem 1rem}.tabs [aria-selected=true]{color:var(--ui-text);border-color:var(--ui-accent)}
.panel{padding:1.2rem .2rem}.panel[hidden],.toast[hidden]{display:none}.disclosure{border:1px solid var(--ui-border);border-radius:var(--ui-radius);overflow:hidden}
.disclosure summary{padding:1rem;cursor:pointer;font-weight:700}.disclosure p{margin:0;padding:0 1rem 1rem;color:var(--ui-muted)}
.field{display:grid;gap:.4rem}.field label{font-weight:700}.field input{width:min(100%,30rem);padding:.75rem;border:1px solid var(--ui-border);border-radius:var(--ui-radius);background:var(--ui-surface);color:var(--ui-text)}
.field small{color:var(--ui-muted)}.toast{display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;border:1px solid var(--ui-border);border-left:5px solid var(--ui-accent);border-radius:var(--ui-radius);padding:1rem}
.metric{border:1px solid var(--ui-border);border-radius:var(--ui-radius);padding:calc(1.2*var(--ui-density));display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap}
.metric span{display:block;color:var(--ui-muted)}.metric strong{display:block;font-size:clamp(2rem,6vw,3.1rem);letter-spacing:-.05em}.metric em{font-style:normal;font-weight:700}
@media(prefers-reduced-motion:no-preference){.primary{transition:transform .15s ease}.primary:hover{transform:translateY(-1px)}}
`;
export const SCRIPT = String.raw`
(() => {
 const toggle=document.querySelector('[data-toggle]');
 if(toggle)toggle.addEventListener('click',()=>{
  const active=toggle.getAttribute('aria-pressed')!=='true';
  toggle.setAttribute('aria-pressed',String(active));
  document.querySelector('[data-status]').textContent=active?'Action activated.':'Action reset.';
 });
 const tabs=[...document.querySelectorAll('[role="tab"]')];
 function choose(tab,focus){
  for(const item of tabs){
   const active=item===tab;item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1;
   const panel=document.getElementById(item.getAttribute('aria-controls'));if(panel)panel.hidden=!active;
  }
  if(focus)tab.focus();
 }
 tabs.forEach((tab,i)=>{
  tab.addEventListener('click',()=>choose(tab,false));
  tab.addEventListener('keydown',event=>{
   let next=-1;
   if(event.key==='ArrowRight')next=(i+1)%tabs.length;
   if(event.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;
   if(event.key==='Home')next=0;
   if(event.key==='End')next=tabs.length-1;
   if(next>=0){event.preventDefault();choose(tabs[next],true);}
  });
 });
 const form=document.querySelector('[data-form]');
 if(form){
  const email=form.querySelector('input[type="email"]');
  const validate=()=>{
   document.querySelector('[data-status]').textContent=email.checkValidity()?'Email format valid. Nothing was sent.':'Enter a valid email address.';
  };
  form.addEventListener('submit',event=>{event.preventDefault();validate();});
  form.querySelector('[data-check]').addEventListener('click',validate);
  email.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();validate();}});
 }
 const show=document.querySelector('[data-show]'),toast=document.querySelector('[data-toast]');
 if(show&&toast){
  show.addEventListener('click',()=>{toast.hidden=false;});
  toast.querySelector('[data-dismiss]').addEventListener('click',()=>{toast.hidden=true;show.focus();});
 }
})();
`;

export function componentMarkup(input){
 const cfg=validateLab(input),title=escapeHTML(cfg.title),body=escapeHTML(cfg.body),action=escapeHTML(cfg.action);
 let html="";
 switch(cfg.type){
 case "button":
  html=`<button type="button" class="primary" data-toggle aria-pressed="false">${action||"Activate"}</button><p data-status role="status" class="status">Press to change the state.</p>`;break;
 case "tabs":
  html=`<div role="tablist" aria-label="Example workspace tabs" class="tabs">
<button type="button" role="tab" id="tab-1" aria-selected="true" aria-controls="panel-1" tabindex="0">Overview</button>
<button type="button" role="tab" id="tab-2" aria-selected="false" aria-controls="panel-2" tabindex="-1">Details</button>
<button type="button" role="tab" id="tab-3" aria-selected="false" aria-controls="panel-3" tabindex="-1">Activity</button></div>
<div class="panel" role="tabpanel" id="panel-1" aria-labelledby="tab-1" tabindex="0">${body}</div>
<div class="panel" role="tabpanel" id="panel-2" aria-labelledby="tab-2" tabindex="0" hidden>Keyboard, mouse and touch controls are supported.</div>
<div class="panel" role="tabpanel" id="panel-3" aria-labelledby="tab-3" tabindex="0" hidden>No data is collected in this demo.</div>`;break;
 case "accordion":
  html=`<details class="disclosure"><summary>How does this component work?</summary><p>${body}</p></details>
<details class="disclosure"><summary>Is this keyboard accessible?</summary><p>Use Tab to focus and Enter or Space to expand the summary.</p></details>`;break;
 case "form":
  html=`<form data-form novalidate class="demo"><div class="field"><label for="email">Email address</label><input id="email" name="email" type="email" autocomplete="off" placeholder="you@example.com" required><small>No information is sent or stored.</small></div>
<button type="button" class="primary" data-check>${action||"Check email"}</button><p class="status" data-status role="status">Enter an address to validate.</p></form>`;break;
 case "toast":
  html=`<button type="button" class="primary" data-show>${action||"Show notification"}</button>
<div class="toast" data-toast hidden role="status"><span>${body}</span><button type="button" class="secondary" data-dismiss>Dismiss</button></div>`;break;
 case "metric":
  html=`<div class="metric" role="group" aria-label="Demo analytics metric"><div><span>Active projects — sample data</span><strong>1,248</strong><span>${body}</span></div><em>+12.4% this month</em></div>`;break;
 default:throw new Error("Unknown component");
 }
 return `<section class="sample" data-component="${cfg.type}"><p class="eyebrow">Original component · ${cfg.type}</p><h1>${title}</h1><p class="intro">${body}</p><div class="demo">${html}</div></section>`;
}
export function buildComponentHTML(input){
 const cfg=validateLab(input);
 return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; form-action 'none'; connect-src 'none'; img-src 'none'; frame-src 'none'; base-uri 'none'">
<meta name="referrer" content="no-referrer"><title>${escapeHTML(cfg.title)} — component</title>
<style>${buildCSS(cfg.theme)}
${STYLES}</style></head><body>${componentMarkup(cfg)}<script>${SCRIPT}</script></body></html>
`;
}
