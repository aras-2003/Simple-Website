# Deployment approval gate

**Status: APPROVED — 2026-09-04**

Właściciel strony zatwierdził pełny zakres projektu, repozytorium `aras-2003/Simple-Website` oraz branch produkcyjny `main`. Poniższe decyzje są baseline'em produkcyjnym.

## Zatwierdzone decyzje
1. **OAF** — publikujemy jako autorski *working model* bez rozwijania skrótu, z czterema warstwami: `Direction → Choices → Priorities → Evidence`. Rozwinięcie nazwy i pełny metamodel mogą wejść w v2 bez blokowania v1.
2. **Domena docelowa** — `arkadiuszkamrowski.pl`; przed realnym cut-over wymagane jest potwierdzenie kontroli DNS.
3. **Topologia AKS** — dedykowany klaster dla strony.
4. **Azure naming** — `rg-ak-site-prod`, `aks-ak-site-prod`; ACR jest osobnym rejestrem i otrzymuje globalnie unikalną nazwę podczas bootstrapu.
5. **Region** — `westeurope`.
6. **Ingress/TLS** — NGINX Ingress + cert-manager + Let's Encrypt.
7. **GitHub → Azure** — OIDC / federated credentials, bez długowiecznych sekretów.
8. **Treść publiczna** — COI, aktualny zakres roli, wcześniejsze Deloitte, MBA oraz publiczne wystąpienia mogą być publikowane.
9. **Kontakt** — LinkedIn jako jedyny CTA w v1; brak formularza i publicznego e-maila.
10. **Analytics** — brak trackingu w v1.
11. **Język** — polski w v1; angielski planowany jako v2.
12. **Repo / branch** — `aras-2003/Simple-Website`, `main`.

## Operacyjne prerequisites — nie są już bramką decyzyjną
Do wykonania rzeczywistego deploymentu Azure nadal potrzebne są wartości techniczne należące do konta/infrastruktury, których nie przechowujemy w repo:
- `AZURE_SUBSCRIPTION_ID`,
- globalnie unikalna nazwa `ACR_NAME` (skrypt może ją wygenerować),
- opcjonalny e-mail ACME dla Let's Encrypt,
- kontrola DNS nad `arkadiuszkamrowski.pl`.

## Kontrola produkcyjna
Workflow `Deploy · Azure AKS` korzysta z GitHub Environment `production`. Zalecane jest włączenie **required reviewer**. Każdy deploy dodatkowo wymaga jawnego inputu `assumptions_approved=true` i musi pochodzić z `main`.
