# Backup do layout vertical — 19/08/2026

Snapshot tirado **antes** do ajuste "subir título / subtítulo / cards".
Serve para voltar atrás sem precisar adivinhar valores.

Commit de referência (estado ANTES): `2e64c50`
Reverter tudo de uma vez:

```bash
git checkout 2e64c50 -- src/components/HeroSection.css src/components/EstruturaSection.jsx src/components/LinhaDoTempo.jsx src/components/CTASection.jsx
```

---

## 1. Valores no código (ANTES)

| Arquivo | Seletor / trecho | Propriedade | Valor ANTES |
|---|---|---|---|
| `src/components/HeroSection.css` | `.brand-masthead` | `--masthead-top-offset` | `2cm` (≈ 75,6px) |
| `src/components/HeroSection.css` | `.brand-masthead` | `--masthead-logo-height` | `260px` |
| `src/components/HeroSection.css` | `.hero-title-block` | `margin-top` | `32px` |
| `src/components/HeroSection.css` | `.hero-title-block` | `margin-bottom` | `0` |
| `src/components/HeroSection.css` | `.carousel-wrapper` | `align-items` | `center` |
| `src/components/HeroSection.css` | `.carousel-wrapper` | `padding-bottom` | `120px` |
| `src/components/EstruturaSection.jsx` | logo (`.brand-masthead`) | `marginBottom` | `32` |
| `src/components/EstruturaSection.jsx` | bloco de título | `marginBottom` | `40` |
| `src/components/EstruturaSection.jsx` | grade 2×2 | `padding` | `'0 24px 242px'` |
| `src/components/LinhaDoTempo.jsx` | logo (`.brand-masthead`) | `marginBottom` | `32` |
| `src/components/LinhaDoTempo.jsx` | bloco de título | `marginBottom` | `40` |
| `src/components/LinhaDoTempo.jsx` | `<section>` do carrossel | `padding` | `'0 0 40px'` |
| `src/components/LinhaDoTempo.jsx` | viewport do carrossel | `alignItems` | `center` |
| `src/components/LinhaDoTempo.jsx` | `.timeline-track` | `padding` | `'20px 0'` |
| `src/components/CTASection.jsx` | logo (`.brand-masthead`) | `marginBottom` | `28` |
| `src/components/CTASection.jsx` | pílula "Fale com a Linde" | classe | `mb-6` (24px) |
| `src/components/ArcCarousel.jsx` | palco do arco | `height` | `CARD_H + 120` |
| `src/components/BottomNav.jsx` | `Nav` | `bottom` | `2cm` |

## 2. Posições medidas no navegador (ANTES) — viewport 1080 × 1920

Coordenadas em px a partir do topo da tela.

| Elemento | Produtos | Estrutura | História | Contato |
|---|---|---|---|---|
| Logo (topo) | 76 | 76 | 76 | 76 |
| Logo (base) | 336 | 336 | 336 | 336 |
| Label / pílula (topo) | 368 | 368 | 368 | 364 |
| Título `h2` (topo) | 396 | 396 | 396 | 429 |
| Título `h2` (base) | 462 | 462 | 462 | 550 |
| Linha dourada | 480 | 480 | 480 | 577 |
| Texto de apoio (base) | 512 | 512 | 512 | — |
| Início dos cards | **656** | **552** | **930** (nominal) | QR 701 |
| Fim dos cards | 1576 | 1678 | 1502 | mapa 1565 |
| Navbar (topo / base) | 1693 / 1844 | idem | idem | idem |

Outros números medidos:
- Card ativo de Produtos: 640 × 920 px (kiosk retrato).
- Card da grade de Estrutura: cresce com a altura da tela (linhas `1fr`); em 1920px fica com 521px de altura visível (escala 0,94).
- Card da linha do tempo: 480 × 572 px nominal; quando está em foco recebe `scale(1.35)` + `lift 110px`, o que faz o topo visual subir ≈ 210px em relação ao nominal.

## 3. Ritmo vertical (ANTES)

```
topo da tela
  ↓ 76px   (--masthead-top-offset: 2cm)
LOGO (260px)
  ↓ 32px
LABEL → TÍTULO → LINHA → TEXTO DE APOIO   (bloco de 145px)
  ↓ 40px   (Estrutura/História; em Produtos o carrossel era centralizado no espaço restante)
CARDS
```

## 4. Screenshots (antes e depois)

Capturados em 1080×1920, fora do repositório:
`%LOCALAPPDATA%\Temp\claude\c--projetos-totem-linde\3a172662-8277-4ccd-b3a7-d3e0fb0e7ee5\scratchpad\layout-shots\`
(`before-*.png` e `after-*.png` de cada aba).

---

## 5. O que ficou DEPOIS do ajuste

| Arquivo | Propriedade | Antes | Depois |
|---|---|---|---|
| `HeroSection.css` → `.brand-masthead` | `--masthead-top-offset` | `2cm` | `24px` |
| `HeroSection.css` → `.brand-masthead` | — | — | novos tokens `--masthead-gap: 32px` e `--heading-gap: 40px` |
| `HeroSection.css` → `.hero-title-block` | `margin-bottom` | `0` | `var(--heading-gap)` = 40px |
| `HeroSection.css` → `.carousel-wrapper` | `align-items` | `center` | `flex-start` |
| `HeroSection.css` → `.carousel-wrapper` | `margin-top` | — | `-20px` (`--arc-overhang`) |
| `EstruturaSection.jsx` → grade | `padding` | `0 24px 242px` | `0 24px 294px` |
| `LinhaDoTempo.jsx` → palco | `flex` | `1` | `0 1 1120px` (`STAGE_HEIGHT`) |
| `CTASection.jsx` → logo | `marginBottom` | `28` | `14` |
| `CTASection.jsx` → pílula | classe | `mb-6` | `mb-2` |

Posições medidas DEPOIS (1080×1920):

| Elemento | Produtos | Estrutura | História | Contato |
|---|---|---|---|---|
| Logo (topo) | 24 | 24 | 24 | 24 |
| Título `h2` (topo) | 345 | 345 | 345 | 345 |
| Início dos cards | 501 | 501 | 775 nominal / ~513 em foco | QR 618 |
| Navbar (topo) | 1693 | 1693 | 1693 | 1693 |

Para subir ou descer TUDO de novo, basta mudar `--masthead-top-offset`
em `HeroSection.css` — as quatro abas acompanham juntas.
Para mexer só na linha do tempo, use `STAGE_HEIGHT` em `LinhaDoTempo.jsx`
(menor = cards mais acima; abaixo de ~1090 a etiqueta "Fundação" começa a ser cortada).
