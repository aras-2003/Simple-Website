#!/usr/bin/env python3
"""One-time, idempotent editorial migration; run only on review branch."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
changed = []

def edit(path, substitutions=(), en_dash=False):
    target = ROOT / path
    text = target.read_text(encoding='utf-8')
    original = text
    for old, new in substitutions:
        if old not in text:
            raise RuntimeError(f'{path}: expected fragment missing: {old[:100]}')
        text = text.replace(old, new)
    if en_dash:
        text = text.replace('—', '–')
    if text != original:
        target.write_text(text, encoding='utf-8')
        changed.append(path)

# Cross-language, user-facing strings. Do not alter hyphens in IDs, URLs or date ranges.
edit('src/content/home.ts', [("od dostarczania technologii i cloud / DevSecOps, przez architekturę, po strategię, portfel i PMO.", "od dostarczania technologii, rozwiązań chmurowych i DevSecOps, przez architekturę, po strategię, portfel inicjatyw i PMO.")], True)
edit('src/content/about.ts', [("Cloud i DevSecOps dały mi perspektywę wykonania: zależności, ograniczeń i odpowiedzialności za działające rozwiązanie.", "Praca z technologiami chmurowymi i DevSecOps dała mi perspektywę realizacji: znajomość zależności, ograniczeń i odpowiedzialności za działające rozwiązania.")], True)
edit('src/content/method.ts', [
 ("OAF — Organizational Architecture Framework — to mój model pracy z relacjami między strategią, organizacją, inwestycjami i wykonaniem.", "OAF (Organizational Architecture Framework) to mój autorski model łączenia strategii, organizacji, inwestycji i realizacji."),
 ("Podstawy i relacje z innymi frameworkami", "Podstawy i relacje z innymi modelami oraz standardami"),
 ("Fit i misfit: projekt organizacji zależny", "Dopasowanie i niedopasowanie: projekt organizacji zależny"),
 ("OAF traktuje misfit jako napięcie", "OAF traktuje niedopasowanie jako napięcie"),
 ("Operating model i enterprise architecture jako fundament", "Model operacyjny (operating model) i architektura korporacyjna jako fundament"),
 ("Metoda, praktyka i governance Enterprise Architecture", "Metoda, praktyka i zasady nadzoru nad architekturą korporacyjną"),
 ("strategia, operating model, portfel", "strategia, model operacyjny, portfel"),
 ("przez value system, governance, praktyki, value streams i continual improvement", "przez system tworzenia wartości, nadzór, praktyki, strumienie wartości i ciągłe doskonalenie"),
 ("praktyk service management", "praktyk zarządzania usługami"),
], True)
edit('src/components/OafPage.astro', [
 ("Zasada governance architektonicznego", "Zasada ładu architektonicznego"),
 ("Celem governance architektonicznego nie jest więcej governance. Chodzi o lepsze decyzje podejmowane szybciej.", "Celem ładu architektonicznego nie jest rozbudowywanie kontroli. Chodzi o lepsze decyzje podejmowane szybciej."),
 ("Dobry governance skraca oczekiwanie, nie myślenie:", "Dobrze zaprojektowany ład architektoniczny skraca czas oczekiwania, nie czas potrzebny na analizę:"),
], True)
edit('src/content/contact.ts', [("Nie potrzebuję pełnego briefu. Przeczytam wiadomość i odpowiem e-mailem: ustalimy, czy i od jakiej rozmowy warto zacząć. Poufne szczegóły zostawmy na później.", "Wystarczy kilka zdań o sytuacji. Przeczytam wiadomość i odpowiem e-mailem. Wtedy ustalimy, czy i od jakiej rozmowy warto zacząć. Poufne szczegóły zostawmy na później.")], True)
edit('src/content/privacy.ts', [
 ("origin żądania", "pochodzenie żądania (nagłówek Origin)"),
 ("Checkbox w formularzu", "Pole wyboru w formularzu"),
 ("usłudze transactional email Resend", "usłudze wysyłki wiadomości transakcyjnych Resend"),
 ("newslettera", "biuletynu"),
 ("Odbiorcy i procesorzy", "Odbiorcy i podmioty przetwarzające"),
 ("dostawcy hostingu/infrastruktury", "dostawcy usług utrzymania serwisu i infrastruktury"),
 ("reklamowych trackerów", "reklamowych narzędzi śledzących"),
 ("cookies analitycznych", "analitycznych plików cookie"),
 ("title: 'Retencja'", "title: 'Okres przechowywania danych'"),
 ("title: 'Transfer poza EOG'", "title: 'Przekazywanie danych poza EOG'"),
], True)
edit('src/content/ui.ts', [("reklamowych trackerów ani cookies analitycznych", "reklamowych narzędzi śledzących ani analitycznych plików cookie")], True)
edit('src/components/ContactForm.astro', en_dash=True)
edit('src/pages/404.astro', en_dash=True)

PL = Path('src/content/writing/pl')
EN = Path('src/content/writing/en')

def article(name, fixes, word_fixes=()):
    path = PL / (name + '.md')
    target = ROOT / path
    text = target.read_text(encoding='utf-8')
    original = text
    for old, new in fixes:
        if old not in text:
            raise RuntimeError(f'{path}: missing: {old[:100]}')
        text = text.replace(old, new)
    # Only replace textual spans: URLs, image HTML tags and cited source labels are immutable.
    if word_fixes:
        lines = text.splitlines(keepends=True)
        frontmatter = False
        in_sources = False
        for i, line in enumerate(lines):
            if line.strip() == '---':
                frontmatter = not frontmatter
                continue
            if frontmatter:
                if line.startswith('sources:'):
                    in_sources = True
                if in_sources or not line.startswith(('title:', 'dek:', 'category:')):
                    continue
            parts = re.split(r'(<[^>]*>|\]\([^)]*\)|https?://\S+)', line)
            for j in range(0, len(parts), 2):
                for pattern, replacement in word_fixes:
                    parts[j] = re.sub(pattern, replacement, parts[j])
            lines[i] = ''.join(parts)
        text = ''.join(lines)
    text = text.replace('—', '–')
    if text != original:
        target.write_text(text, encoding='utf-8')
        changed.append(str(path))

article('architecture-as-decision-system', [
 ('Governance jest środkiem, nie wynikiem', 'Ład architektoniczny jest środkiem, nie wynikiem'),
 ('Celem architecture governance', 'Celem ładu architektonicznego'),
 ('Dobry governance skraca oczekiwanie, nie myślenie.', 'Dobrze zaprojektowany ład architektoniczny skraca czas oczekiwania, nie czas potrzebny na analizę.'),
 ('approvalu', 'zatwierdzenia'), ('formalny zewnętrzny review', 'formalny przegląd prowadzony poza zespołem'),
 ('Badania DORA nad change approval', 'Badania DORA nad zatwierdzaniem zmian'),
 ('change-fail rate', 'odsetek nieudanych zmian (change fail rate, CFR)'),
 ('**Decyzja ograniczona guardrailami**', '**Decyzja podejmowana w uzgodnionych granicach**'),
 ('odejście od guardrailu', 'odstępstwo od uzgodnionej zasady'),
 ('w granicach istniejących guardraili', 'w granicach istniejących zasad'),
 ('**Decyzja enterprise**', '**Decyzja o skutkach dla całej organizacji**'),
 ('perspektywy enterprise', 'perspektywy całej organizacji'),
 ('„decision-making winners”', '„organizacje wyróżniające się w podejmowaniu decyzji”'),
], [(r'\bgovernance\b', 'nadzór'), (r'\bGovernance\b', 'Nadzór')])
article('portfolio-as-strategy-in-motion', [
 ('title: Portfolio jest strategią w ruchu', 'title: Portfel inicjatyw jest strategią w ruchu'),
 ('dek: Deklarowana strategia mówi, co jest ważne. Portfolio pokazuje', 'dek: Deklarowana strategia mówi, co jest ważne. Portfel inicjatyw pokazuje'),
 ("617 executive'ów i menedżerów", '617 osób na stanowiskach kierowniczych'),
 ('decyzje stop, start i continue', 'decyzje o zatrzymaniu, rozpoczęciu i kontynuowaniu inicjatyw'),
 ('business case wygląda atrakcyjnie', 'uzasadnienie biznesowe wygląda przekonująco'),
 ('Nic nie zostało spriorytetyzowane.', 'Nie ustalono rzeczywistych priorytetów.'),
 ('jawne zwiększenie capacity', 'jawne zwiększenie możliwości wykonawczych'),
 ('ponadprzeciętnym ROIC', 'ponadprzeciętnym zwrotem z zainwestowanego kapitału (return on invested capital, ROIC)'),
], [(r'\bPortfolio\b', 'Portfel'), (r'\bportfolio\b', 'portfel'), (r'\bgovernance\b', 'zarządzanie portfelem')])
article('transformation-operating-model', [
 ('title: Transformacja potrzebuje operating modelu, nie tylko roadmapy', 'title: Transformacja potrzebuje modelu operacyjnego, nie tylko planu'),
 ('dek: "Roadmapa pokazuje kolejność. Operating model odpowiada', 'dek: "Plan pokazuje kolejność. Model operacyjny odpowiada'),
 ('## Roadmapa jest hipotezą o wykonaniu', '## Plan transformacji jest hipotezą dotyczącą realizacji'),
 ('## Operating model to mechanizm adaptacji', '## Model operacyjny to mechanizm adaptacji'),
 ('decision churn', 'ciągłe podważanie wcześniejszych decyzji'),
 ("2000 executive'ów", '2000 osób na stanowiskach kierowniczych'),
 ('redesign operating modelu', 'przebudowa modelu operacyjnego'),
 ('redesignów', 'projektów przebudowy'),
 ('steering committee', 'komitet sterujący'),
 ('transformation office', 'biuro transformacji'),
 ("baseline'em", 'uzgodnionym planem bazowym'), ("baseline'u", 'planu bazowego'),
 ('Portfolio może zdecydować', 'Osoby zarządzające portfelem inicjatyw mogą zdecydować'),
], [(r'\boperating modelu\b', 'modelu operacyjnego'), (r'\boperating model\b', 'model operacyjny'),
    (r'\bOperating model\b', 'Model operacyjny'), (r'\broadmapa\b', 'plan transformacji'),
    (r'\bRoadmapa\b', 'Plan transformacji'), (r'\broadmapy\b', 'planu transformacji'),
    (r'\broadmapę\b', 'plan transformacji'), (r'\bgovernance\b', 'nadzór')])
article('ai-governance-without-theatre', [
 ('category: Autonomia, ryzyko i governance', 'category: Autonomia, ryzyko i nadzór'),
 ('title: AI governance bez teatru kontroli', 'title: Nadzór nad AI bez teatru kontroli'),
 ('dek: Dojrzałe AI governance nie zatrzymuje eksperymentu. Zwiększa siłę kontroli wtedy, gdy rosną autonomia systemu, konsekwencja decyzji i trudność odwrócenia skutku.', 'dek: Dojrzały nadzór nad AI nie zatrzymuje eksperymentowania. Zwiększa siłę kontroli wtedy, gdy rosną autonomia systemu, konsekwencje jego działania i trudność odwrócenia skutków.'),
 ('## Adopcja wyprzedza dojrzałość governance', '## Wykorzystanie AI wyprzedza dojrzałość nadzoru'),
 ('## AI Act wyznacza floor, nie cały operating model governance', '## AI Act wyznacza minimum prawne, nie cały model nadzoru'),
 ('## „Human in the loop” nie jest modelem governance', '## Sam udział człowieka nie wystarcza'),
 ('W uzupełniającym badaniu executive\'ów', 'W uzupełniającym badaniu osób na stanowiskach kierowniczych'),
 ('rollout generatywnej AI', 'wdrożenie generatywnej AI w skali organizacji'),
 ('lepszego evidence', 'lepszych dowodów'),
 ('compliance floor', 'minimalne wymagania prawne'),
 ('AI literacy', 'kompetencji w zakresie AI'),
 ('high-risk', 'wysokiego ryzyka'),
 ('Annex III', 'załącznika III'), ('Annex I', 'załącznika I'),
 ('„Human in the loop”', '„Udział człowieka w procesie decyzyjnym (human in the loop, HITL)”'),
 ('„human in the loop”', '„udział człowieka w procesie decyzyjnym”'),
 ('„czy rozwiązanie przeszło review?”', '„czy rozwiązanie przeszło przegląd?”'),
 ('„przeszło AI review”', '„przeszło przegląd rozwiązania AI”'),
 ('28% respondentów wskazało CEO, a 17% board', '28% respondentów wskazało prezesa (CEO), a 17% radę dyrektorów (board)'),
], [(r'\bAI governance\b', 'nadzór nad AI'), (r'\bgovernance\b', 'nadzór'),
    (r'\boperating modelu\b', 'modelu operacyjnego'), (r'\bmonitoringu\b', 'monitorowania'),
    (r'\bmonitoring\b', 'monitorowanie'), (r'\bcompliance\b', 'zgodność z przepisami')])
article('delivery-beyond-deployment', [
 ('category: Operating model i wykonanie', 'category: Model operacyjny i realizacja'),
 ('dek: Sprawniejszy deployment nie musi skracać drogi od potrzeby biznesowej do korzyści. Delivery Director potrzebuje widzieć cały przepływ, nie tylko jego techniczny fragment.', 'dek: Sprawniejsze wdrażanie oprogramowania nie musi skracać drogi od potrzeby biznesowej do korzyści. Osoba odpowiedzialna za dostarczanie rozwiązań musi widzieć cały przepływ, nie tylko jego techniczny fragment.'),
 ('Na przeglądzie delivery wygląda to dobrze', 'Na przeglądzie realizacji wszystko wygląda dobrze'),
 ('Deployment Frequency jest ważnym sygnałem', 'Częstotliwość wdrożeń (deployment frequency) jest ważnym sygnałem'),
 ('trzy oddzielne dashboardy', 'trzy oddzielne zestawienia wskaźników'),
 ('<strong>Engineering performance</strong>', '<strong>Sprawność inżynierska</strong>'),
 ('<strong>Delivery performance</strong>', '<strong>Sprawność dostarczania rozwiązań</strong>'),
 ('<strong>Business outcomes</strong>', '<strong>Efekty biznesowe</strong>'),
 ('Czas od commitu do produkcji', 'Czas od zapisania zmiany w repozytorium do wdrożenia na produkcję'),
 ('pięć metryk obejmujących change lead time, deployment frequency, failed deployment recovery time, change fail rate i deployment rework rate.', 'pięć metryk: czas realizacji zmiany (change lead time), częstotliwość wdrożeń (deployment frequency), czas przywrócenia działania po nieudanym wdrożeniu (failed deployment recovery time), odsetek nieudanych zmian (change fail rate, CFR) i odsetek nieplanowanych wdrożeń naprawczych (deployment rework rate).'),
 ('*Change lead time* DORA liczy czas od commitu do produkcji.', 'Czas realizacji zmiany w modelu DORA liczy się od zapisania zmiany w repozytorium do wdrożenia na produkcję.'),
 ('*time to market* lub *time to value*', 'czasie wprowadzenia rozwiązania na rynek (time to market, TTM) lub czasie do uzyskania wartości (time to value, TTV)'),
 ('kolejna inwestycja w pipeline', 'kolejna inwestycja w automatyzację wdrożeń'),
 ('ograniczenie delivery', 'ograniczenie w dostarczaniu rozwiązań'),
 ('Za adopcję odpowiada', 'Za rzeczywiste wykorzystanie rozwiązania odpowiada'),
 ('zarządzanie delivery', 'zarządzanie dostarczaniem rozwiązań'),
 ('kolejny dashboard CI/CD', 'kolejny pulpit wskaźników CI/CD'),
 ('## Delivery Director nie musi kontrolować wszystkiego. Musi widzieć całość', '## Dyrektor odpowiedzialny za dostarczanie rozwiązań nie musi kontrolować wszystkiego. Musi widzieć całość'),
 ('Rolą Delivery Directora', 'Rolą dyrektora odpowiedzialnego za dostarczanie rozwiązań (Delivery Director)'),
 ('Zielony dashboard inżynierski mówi, że pewna część systemu działa sprawniej. Zadaniem Delivery Directora jest ustalić, czy sprawniej działa również całość.', 'Zielone wskaźniki inżynierskie pokazują, że część procesu działa sprawniej. Zadaniem dyrektora odpowiedzialnego za dostarczanie rozwiązań jest sprawdzić, czy skróciła się również cała droga – od potrzeby klienta do osiągnięcia oczekiwanej korzyści.'),
 ('razem z change fail rate, deployment rework rate,', 'razem z odsetkiem nieudanych zmian (CFR), odsetkiem nieplanowanych wdrożeń naprawczych,'),
], [(r'\bdelivery\b', 'dostarczaniu rozwiązań')])

# The two localised essays share the same published category.
p = PL / 'transformation-operating-model.md'
t = (ROOT/p).read_text(encoding='utf-8')
t2 = t.replace('category: Operating model i wykonanie', 'category: Model operacyjny i realizacja')
if t != t2:
    (ROOT/p).write_text(t2, encoding='utf-8')
    if str(p) not in changed: changed.append(str(p))

for source in sorted((ROOT/EN).glob('*.md')):
    original = source.read_text(encoding='utf-8')
    revised = original.replace('—', '–')
    if original != revised:
        source.write_text(revised, encoding='utf-8')
        changed.append(str(source.relative_to(ROOT)))

# Locale-sensitive 404: direct English page and proper 404 status for unknown /en/* routes.
english_404 = ROOT/'src/pages/en/404.astro'
english_404.write_text('''---
import BaseLayout from '../../layouts/BaseLayout.astro';
---
<BaseLayout locale="en" routeKey="home" title="404 – Page not found" description="Page not found.">
  <section class="page-hero error-page">
    <p class="eyebrow">404</p>
    <h1>That page isn't here.</h1>
    <p class="page-lead">Check the address or return to the <a class="text-link" href="/en">English home page</a>.</p>
  </section>
</BaseLayout>
''', encoding='utf-8')
changed.append('src/pages/en/404.astro')
edit('worker/index.mjs', [("    const response = await env.ASSETS.fetch(request);\n    return applyDeploymentHeaders(response, env);", "    const response = await env.ASSETS.fetch(request);\n    if (response.status === 404 && (url.pathname === '/en' || url.pathname.startsWith('/en/'))) {\n      const fallbackUrl = new URL('/en/404', request.url);\n      const englishPage = await env.ASSETS.fetch(new Request(fallbackUrl, request));\n      if (englishPage.ok) {\n        const headers = new Headers(englishPage.headers);\n        headers.set('Cache-Control', 'no-store');\n        headers.set('X-Robots-Tag', 'noindex, nofollow');\n        return applyDeploymentHeaders(new Response(englishPage.body, { status: 404, headers }), env);\n      }\n    }\n    return applyDeploymentHeaders(response, env);")], True)

# Language and punctuation guard for future changes: human-facing text only, not CSS syntax or URLs.
lint = ROOT/'tests/editorial-language.mjs'
lint.write_text('''import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
const files = ['src/content/home.ts','src/content/about.ts','src/content/method.ts','src/content/contact.ts','src/content/privacy.ts','src/content/ui.ts','src/components/OafPage.astro','src/components/ContactForm.astro','src/pages/404.astro','src/pages/en/404.astro'];
for (const locale of ['pl','en']) for (const name of await readdir(`src/content/writing/${locale}`)) if (name.endsWith('.md')) files.push(`src/content/writing/${locale}/${name}`);
for (const file of files) {
  const text = await readFile(file, 'utf8');
  assert.ok(!text.includes('—'), `${file}: use en dash U+2013, not em dash U+2014`);
}
const en404 = await readFile('dist/en/404/index.html', 'utf8');
assert.match(en404, /<html[^>]+lang="en"/);
assert.match(en404, /404 – Page not found/);
console.log(`Editorial punctuation checked in ${files.length} sources; English 404 generated.`);
''', encoding='utf-8')
changed.append('tests/editorial-language.mjs')
# Add no scripts to package.json: static CI gate via existing predeploy check integration.
edit('tests/static.mjs', [("const privacyPl = await readFile(routeFile('/privacy'), 'utf8');", "const englishNotFound = await readFile(routeFile('/en/404'), 'utf8');\nif (!/<html[^>]+lang=\"en\"/.test(englishNotFound) || !englishNotFound.includes('404 – Page not found')) errors.push('/en/404: missing localized error page');\nconst privacyPl = await readFile(routeFile('/privacy'), 'utf8');"), ("'Transfer poza EOG'", "'Przekazywanie danych poza EOG'")])
print('Modified:', ', '.join(changed))
