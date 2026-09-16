#!/usr/bin/env python3
from pathlib import Path
root=Path(__file__).resolve().parents[1]
fixes={
'src/content/writing/pl/architecture-as-decision-system.md':[
 ('autonomia została pomylona z brakiem nadzór.', 'autonomia została pomylona z brakiem nadzoru.'),
],
'src/content/writing/pl/portfolio-as-strategy-in-motion.md':[
 ('Portfel nie powinno być', 'Portfel nie powinien być'),
 ('Powinno być jednym z głównych miejsc', 'Powinien być jednym z głównych miejsc'),
 ('Dobra rozmowa portfel powinna', 'Dobra rozmowa o portfelu powinna'),
 ('portfel powinno pokazać', 'portfel powinien pokazać'),
 ('czy tę pojemność uzyskujemy przez stop, realokację', 'czy tę pojemność uzyskujemy przez zatrzymanie inicjatywy, realokację'),
],
'src/content/writing/pl/transformation-operating-model.md':[
 ('category: Model operacyjny i wykonanie', 'category: Model operacyjny i realizacja'),
 ('że plan transformacji jest zbędna.', 'że plan transformacji jest zbędny.'),
 ('Potrzebuje modelu operacyjnego, który pozwala', 'Potrzebuje modelu operacyjnego (operating model), który pozwala'),
 ('przebudowa modelu operacyjnego spełnił większość celów i poprawił wyniki', 'przebudowa modelu operacyjnego spełniła większość celów i poprawiła wyniki'),
 ('dla biuro transformacji lub PMO', 'dla biura transformacji lub PMO'),
],
'src/content/writing/pl/ai-governance-without-theatre.md':[
 ('\nnadzór nad AI nie jest', '\nNadzór nad AI nie jest'),
 ('wdrożenie generatywnej AI w skali organizacji jako dojrzały.', 'wdrożenie generatywnej AI w skali organizacji za dojrzałe.'),
 ('Sam poziom adopcji szybko się zmienia.', 'Sam poziom wykorzystania AI szybko się zmienia.'),
 ('mechanizmu nadzór potrzebujemy', 'mechanizmu nadzoru potrzebujemy'),
 ('zasady nadzór i obowiązki', 'zasady nadzoru i obowiązki'),
 ('minimalne wymagania prawne nie zwalnia organizacji', 'spełnienie minimalnych wymagań prawnych nie zwalnia organizacji'),
 ('## Governance powinien być częścią cyklu życia', '## Nadzór powinien być częścią cyklu życia'),
 ('Governance powinien wskazywać właściciela', 'System nadzoru powinien wskazywać właściciela'),
 ('nadzór nad nadzór nad AI', 'nadzór nad AI'),
 ('w nadzór architektonicznym', 'w ładzie architektonicznym'),
 ('mechanizm nadzór.', 'mechanizm nadzoru.'),
],
'src/content/writing/pl/delivery-beyond-deployment.md':[
 ('przepływu. kolejna inwestycja', 'przepływu. Kolejna inwestycja'),
 ('Dostępność rozwiązania, adopcja, koszt procesu', 'Dostępność rozwiązania, rzeczywiste wykorzystanie, koszt procesu'),
],
}
for path, pairs in fixes.items():
    target=root/path; txt=target.read_text('utf8'); start=txt
    for old,new in pairs:
        assert old in txt, f'{path}: missing {old!r}'
        txt=txt.replace(old,new)
    if start!=txt:
        target.write_text(txt,'utf8')
        print(path, len(pairs))

# Regression: English missing routes must render the English 404 with HTTP 404;
# Polish missing routes still retain the Polish page, and assets still pass through.
(root/'tests/404-worker.mjs').write_text('''import assert from 'node:assert/strict';
import worker from '../worker/index.mjs';
const origin = 'https://staging.arkadiuszkamrowski.com';
const fetched = [];
const env = {
  DEPLOYMENT_ENV: 'staging',
  ASSETS: { async fetch(request) {
    const pathname = new URL(request.url).pathname;
    fetched.push(pathname);
    if (pathname === '/en/404') return new Response('<html lang="en"><h1>That page isn\\'t here.</h1></html>', {status:200,headers:{'Content-Type':'text/html; charset=utf-8'}});
    if (pathname === '/en/about') return new Response('<html lang="en">About</html>', {status:200});
    return new Response('<html lang="pl">Nie ma tu tej strony.</html>', {status:404,headers:{'Content-Type':'text/html; charset=utf-8'}});
  }},
};
const missingEn=await worker.fetch(new Request(origin+'/en/unknown-slug'), env);
assert.equal(missingEn.status,404);
assert.match(await missingEn.text(), /lang="en"/);
assert.equal(missingEn.headers.get('x-robots-tag'),'noindex, nofollow, noarchive');
assert.deepEqual(fetched,['/en/unknown-slug','/en/404']);
fetched.length=0;
const missingPl=await worker.fetch(new Request(origin+'/nie-ma'),env);
assert.equal(missingPl.status,404);
assert.match(await missingPl.text(), /lang="pl"/);
assert.deepEqual(fetched,['/nie-ma']);
fetched.length=0;
const existing=await worker.fetch(new Request(origin+'/en/about'),env);
assert.equal(existing.status,200);
assert.deepEqual(fetched,['/en/about']);
console.log('PL and EN 404 worker routing: PASS');
''','utf8')

package=root/'package.json'
text=package.read_text('utf8')
old='node tests/worker-contact.mjs && node tests/measurement.mjs'
assert old in text
package.write_text(text.replace(old,'node tests/worker-contact.mjs && node tests/404-worker.mjs && node tests/measurement.mjs'),'utf8')
