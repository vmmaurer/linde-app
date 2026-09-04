import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { products } from './data/products'
import { fichasTecnicas } from './data/fichaTecnica'
import TrilhaAlfabetica from './components/TrilhaAlfabetica'
import ProdutoDetalhe from './components/ProdutoDetalhe'
import FichaMobile from './components/FichaMobile'
import { Chevron, Documento, Lupa, SemResultado, Xis } from './components/icones'
import { fatiarBusca, inicial, normalizar } from './utils/texto'

// ══════════════════════════════════════════════════════════════
//  CATÁLOGO DO VENDEDOR
//  ─────────────────────────────────────────────────────────────
//  Tela única do app: lista alfabética dos vidros, busca e trilha A–Z,
//  com cada item abrindo em tela cheia. Nenhum texto de produto é
//  escrito aqui — quem manda é src/data/products.js (e fichaTecnica.js
//  para os que têm ficha). Vidro novo lá dentro aparece sozinho aqui.
// ══════════════════════════════════════════════════════════════

/** Lista ordenada pelo nome que aparece no card, ignorando acento. */
const ORDENADOS = [...products].sort((a, b) =>
  normalizar(a.title).localeCompare(normalizar(b.title), 'pt-BR'),
)

/** Texto onde a busca procura: só o nome do vidro, como aparece no card. */
const indiceDe = (p) => normalizar(p.title)

const BUSCAVEIS = new Map(ORDENADOS.map((p) => [p.slug, indiceDe(p)]))

export default function App() {
  const [busca, setBusca] = useState('')
  const [focoBusca, setFocoBusca] = useState(false)
  const [letraAtiva, setLetraAtiva] = useState(null)
  const [produto, setProduto] = useState(null)
  const [fichaAberta, setFichaAberta] = useState(false)

  const topoRef = useRef(null)
  const secoesRef = useRef({})
  const produtoRef = useRef(null)

  // ── Altura real do cabeçalho fixo ───────────────────────────
  // O recuo da lista, o topo da trilha e o "gruda" das letras dependem
  // dela. Medir evita chutar um valor que muda com a fonte do sistema.
  useLayoutEffect(() => {
    const medir = () => {
      const alt = topoRef.current?.offsetHeight
      if (alt) document.documentElement.style.setProperty('--cat-topo', `${alt}px`)
    }
    medir()
    const ro = new ResizeObserver(medir)
    if (topoRef.current) ro.observe(topoRef.current)
    window.addEventListener('orientationchange', medir)
    return () => {
      ro.disconnect()
      window.removeEventListener('orientationchange', medir)
    }
  }, [])

  // ── Resultado da busca, agrupado por letra ──────────────────
  const secoes = useMemo(() => {
    const alvo = normalizar(busca)
    if (alvo) {
      // Resultado de busca não se separa por letra: a ordem que importa é a
      // do que foi encontrado, e um cabeçalho por item deixaria a lista picada.
      const achados = ORDENADOS.filter((p) => BUSCAVEIS.get(p.slug).includes(alvo))
      return achados.length ? [{ letra: 'busca', itens: achados }] : []
    }

    const lista = ORDENADOS
    const grupos = []
    lista.forEach((p) => {
      const letra = inicial(p.title)
      const ultimo = grupos[grupos.length - 1]
      if (ultimo && ultimo.letra === letra) ultimo.itens.push(p)
      else grupos.push({ letra, itens: [p] })
    })
    return grupos
  }, [busca])

  const letras = useMemo(() => secoes.map((s) => s.letra), [secoes])
  const totalItens = useMemo(() => secoes.reduce((n, s) => n + s.itens.length, 0), [secoes])

  // ── Qual letra está passando sob o cabeçalho ────────────────
  useEffect(() => {
    if (letras.length === 0) return

    let agendado = false
    const conferir = () => {
      agendado = false
      const pagina = document.scrollingElement || document.documentElement
      const alturaViewport = Math.max(
        pagina.clientHeight,
        window.innerHeight || 0,
        window.visualViewport?.height || 0,
      )
      const distanciaDoFim = pagina.scrollHeight - pagina.scrollTop - alturaViewport
      const ultimaSecao = secoesRef.current[letras[letras.length - 1]]
      const limiteInferior = alturaViewport + 48
      const ultimaSecaoInteiraVisivel = Boolean(
        ultimaSecao && ultimaSecao.getBoundingClientRect().bottom <= limiteInferior,
      )
      const noFim = distanciaDoFim <= 24 || ultimaSecaoInteiraVisivel

      // A última seção geralmente cabe inteira antes de o título alcançar o
      // cabeçalho. Além disso, Safari/Chrome móveis variam a altura útil ao
      // esconder a barra de endereço e nem sempre informam o último pixel
      // exato. Se a seção final já está inteira visível, ela é a seção ativa.
      if (noFim) {
        setLetraAtiva(letras[letras.length - 1])
        return
      }

      const limite = (topoRef.current?.offsetHeight || 132) + 24
      let atual = letras[0]
      for (const letra of letras) {
        const el = secoesRef.current[letra]
        if (el && el.getBoundingClientRect().top <= limite) atual = letra
      }
      setLetraAtiva(atual)
    }

    const aoRolar = () => {
      if (agendado) return
      agendado = true
      requestAnimationFrame(conferir)
    }

    conferir()
    window.addEventListener('scroll', aoRolar, { passive: true })
    window.addEventListener('resize', aoRolar, { passive: true })
    window.visualViewport?.addEventListener('resize', aoRolar, { passive: true })
    return () => {
      window.removeEventListener('scroll', aoRolar)
      window.removeEventListener('resize', aoRolar)
      window.visualViewport?.removeEventListener('resize', aoRolar)
    }
  }, [letras])

  const irParaLetra = useCallback((letra) => {
    const el = secoesRef.current[letra]
    if (!el) return
    const alturaTopo = topoRef.current?.offsetHeight || 132
    const pagina = document.scrollingElement || document.documentElement
    const yDesejado = el.getBoundingClientRect().top + pagina.scrollTop - alturaTopo - 8
    const yMaximo = Math.max(0, pagina.scrollHeight - pagina.clientHeight)
    window.scrollTo({ top: Math.min(yMaximo, Math.max(0, yDesejado)), behavior: 'auto' })
    setLetraAtiva(letra)
  }, [])

  // ── Navegação: cada tela é um passo no histórico ────────────
  // Com isso o "voltar" do Android (e o gesto de borda do iOS) fecha a
  // ficha, depois o produto, em vez de sair do catálogo de uma vez.
  useEffect(() => {
    const aoVoltar = (e) => {
      const nivel = e.state?.catalogo ?? 0
      setFichaAberta(nivel >= 2)
      if (nivel === 0) {
        setProduto(null)
        produtoRef.current = null
      } else if (produtoRef.current) {
        setProduto(produtoRef.current)
      }
    }
    window.addEventListener('popstate', aoVoltar)
    return () => window.removeEventListener('popstate', aoVoltar)
  }, [])

  // Trava a rolagem da lista enquanto uma tela cheia está por cima.
  useEffect(() => {
    document.body.style.overflow = produto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [produto])

  const abrirProduto = (p) => {
    produtoRef.current = p
    setProduto(p)
    window.history.pushState({ catalogo: 1 }, '')
  }
  const abrirFicha = () => {
    setFichaAberta(true)
    window.history.pushState({ catalogo: 2 }, '')
  }
  const voltar = () => window.history.back()

  const ficha = produto?.ficha ? fichasTecnicas[produto.ficha] : null

  return (
    <div className="cat">
      {/* ══ Cabeçalho: marca + busca ══ */}
      <header className="cat-topo" ref={topoRef}>
        <div className="cat-marca">
          <img
            className="cat-marca__logo"
            src="./images/logonavbar.webp"
            alt="Linde Vidros"
            draggable={false}
          />
          <span className="cat-marca__rotulo">Catálogo</span>
        </div>

        <div className={`cat-busca${focoBusca || busca ? ' cat-busca--ativa' : ''}`}>
          <Lupa cor={focoBusca || busca ? '#f0c832' : 'rgba(240,240,240,0.55)'} />
          <input
            className="cat-busca__campo"
            type="text"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Buscar vidro pelo nome"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onFocus={() => setFocoBusca(true)}
            onBlur={() => setFocoBusca(false)}
            aria-label="Buscar no catálogo"
          />
          {busca && (
            <button
              type="button"
              className="cat-busca__limpar"
              aria-label="Limpar busca"
              onClick={() => setBusca('')}
            >
              <Xis />
            </button>
          )}
        </div>
      </header>

      {/* ══ Trilha A–Z — some durante a busca, quando a ordem já é o resultado ══ */}
      {!busca && letras.length > 1 && (
        <TrilhaAlfabetica letras={letras} ativa={letraAtiva} onEscolher={irParaLetra} />
      )}

      {/* ══ Lista ══ */}
      <main className={`cat-lista${busca ? ' cat-lista--busca' : ''}`}>
        <p className="cat-contagem">{resumoContagem(totalItens, Boolean(busca))}</p>

        {secoes.length === 0 && (
          <div className="cat-vazio">
            <SemResultado />
            <p className="cat-vazio__titulo">Nada com “{busca}”</p>
            <p className="cat-vazio__txt">
              A busca é pelo nome do vidro.
              <br />
              Tente “temperado”, “laminado” ou “espelho”.
            </p>
          </div>
        )}

        {secoes.map((secao, iSecao) => (
          <section
            className="cat-secao"
            key={secao.letra}
            ref={(el) => { secoesRef.current[secao.letra] = el }}
          >
            {!busca && <h2 className="cat-secao__letra">{secao.letra}</h2>}

            <div className="cat-secao__itens">
              {secao.itens.map((p, i) => (
                <ItemProduto
                  key={p.slug}
                  produto={p}
                  termo={busca}
                  atraso={Math.min(iSecao * 2 + i, 12) * 0.022}
                  onAbrir={() => abrirProduto(p)}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* ══ Telas por cima ══ */}
      {produto && (
        <ProdutoDetalhe
          key={produto.slug}
          produto={produto}
          temFicha={Boolean(ficha)}
          onVoltar={voltar}
          onAbrirFicha={abrirFicha}
        />
      )}
      {produto && ficha && fichaAberta && <FichaMobile ficha={ficha} onFechar={voltar} />}
    </div>
  )
}

/** "17 produtos" na lista cheia; "1 produto encontrado" no resultado da busca. */
function resumoContagem(quantos, buscando) {
  if (quantos === 0) return 'Nenhum produto'
  const nome = quantos === 1 ? 'produto' : 'produtos'
  if (!buscando) return `${quantos} ${nome}`
  return `${quantos} ${nome} ${quantos === 1 ? 'encontrado' : 'encontrados'}`
}

/** Uma linha da lista: capa, nome, chamada e o selo de quem tem ficha. */
function ItemProduto({ produto, termo, atraso, onAbrir }) {
  const qtdMidias = produto.media?.length || 0

  return (
    <button
      type="button"
      className="cat-item"
      style={{ animationDelay: `${atraso}s` }}
      onClick={onAbrir}
    >
      <span className="cat-item__foto">
        <img src={produto.image} alt="" loading="lazy" decoding="async" draggable={false} />
        {qtdMidias > 1 && <span className="cat-item__qtd">{qtdMidias}</span>}
      </span>

      <span className="cat-item__texto">
        <span className="cat-item__titulo">
          <Realce texto={produto.title} termo={termo} />
        </span>
        <span className="cat-item__sub">
          <Realce texto={produto.subtitle} termo={termo} />
        </span>
        {produto.ficha && (
          <span className="cat-item__ficha">
            <Documento size={10} />
            Ficha
          </span>
        )}
      </span>

      <Chevron size={17} />
    </button>
  )
}

/** Pinta em Sunshine o trecho que casou com a busca. */
function Realce({ texto, termo }) {
  if (!termo) return texto
  return fatiarBusca(texto, termo).map((parte, i) =>
    parte.marcado ? (
      <mark className="cat-marca-txt" key={i}>{parte.txt}</mark>
    ) : (
      <React.Fragment key={i}>{parte.txt}</React.Fragment>
    ),
  )
}
