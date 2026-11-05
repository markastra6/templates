import test from "node:test";
import assert from "node:assert/strict";
import { PRESETS } from "../site/ui-tokens.js";
import { TYPES, defaultLab, validateLab, componentMarkup, buildComponentHTML } from "../site/component-lab-core.js";

test("six original component templates render self-contained HTML without remote assets", () => {
  assert.deepEqual(TYPES,["button","tabs","accordion","form","toast","metric"]);
  for (const type of TYPES) {
    const conf=defaultLab(type,PRESETS.night);
    assert.deepEqual(validateLab(conf),conf);
    const html=buildComponentHTML(conf);
    assert.match(html,/<!doctype html>/);
    assert.match(html,/Content-Security-Policy/);
    assert.match(html,/default-src 'none'/);
    assert.match(html,/--ui-accent: #7be1bf;/);
    assert.match(html,/data-component="/);
    assert.match(html,/<script>/);
    assert.doesNotMatch(html,/<script[^>]+src=/);
    assert.doesNotMatch(html,/<link[^>]+href=/);
    assert.doesNotMatch(html,/https?:\/\//);
  }
});

test("interactive primitives use semantic accessibility and local state controls", () => {
  assert.match(componentMarkup(defaultLab("button")),/aria-pressed="false"/);
  const tabs=componentMarkup(defaultLab("tabs"));
  assert.match(tabs,/role="tablist"/);
  assert.match(tabs,/aria-controls="panel-1"/);
  assert.match(tabs,/aria-labelledby="tab-3"/);
  assert.match(componentMarkup(defaultLab("accordion")),/<details/);
  assert.match(componentMarkup(defaultLab("form")),/novalidate/);
  assert.match(componentMarkup(defaultLab("form")),/type="email"/);
  assert.doesNotMatch(componentMarkup(defaultLab("form")),/\saction=/);
  assert.match(componentMarkup(defaultLab("toast")),/role="status"/);
  assert.match(componentMarkup(defaultLab("metric")),/sample data/);
});

test("user-controlled text is escaped and never interpolated into scripts or CSS", () => {
  const cfg=defaultLab("toast");
  cfg.title='<img src=x onerror=alert(1)>';
  cfg.body='Escape </script><script>window.infected=1</script> & "quotes"';
  cfg.action='"><svg onload=alert(1)>';
  const html=buildComponentHTML(cfg);
  assert.match(html,/&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(html,/&lt;\/script&gt;&lt;script&gt;/);
  assert.match(html,/&amp; &quot;quotes&quot;/);
  assert.doesNotMatch(html,/<img src=x/);
  assert.doesNotMatch(html,/<script>window\.infected/);
  assert.doesNotMatch(html,/<svg onload=/);
  assert.equal((html.match(/<script>/g)||[]).length,1);
});

test("invalid component imports cannot change the known schema or theme", () => {
  const good=defaultLab();
  const invalid=value=>assert.throws(()=>validateLab(value),/Invalid/);
  invalid({...good,type:"custom-script"});
  invalid({...good,version:2});
  invalid({...good,title:""});
  invalid({...good,title:"x".repeat(91)});
  invalid({...good,body:"x".repeat(241)});
  invalid({...good,action:"x".repeat(41)});
  invalid({...good,theme:{...good.theme,font:"url(https://example.test)"}});
  invalid({...good,theme:{...good.theme,colors:{...good.theme.colors,accent:"#000000;body{display:none}"}}});
  assert.throws(()=>defaultLab("__proto__"),/Invalid/);
});
