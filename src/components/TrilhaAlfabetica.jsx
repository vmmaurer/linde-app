import React, { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Trilha A–Z fixa na lateral esquerda (a barrinha do rascunho).
 *
 * Só aparecem as letras que existem na lista — hoje A, E, L, M, P, S, T, V.
 * Funciona de dois jeitos, como o índice do catálogo telefônico do celular:
 *   • toque numa letra   → pula para a seção
 *   • arraste pela barra → percorre as seções, com a bolha grande mostrando
 *     onde o dedo está (o dedo tapa a letra de 11px; a bolha não).
 */
export default function TrilhaAlfabetica({ letras, ativa, onEscolher }) {
  const [arrastando, setArrastando] = useState(false)
  const botoesRef = useRef([])
  const limitesRef = useRef([])
  const bolhaRef = useRef(null)
  const bolhaYRef = useRef(0)
  const quadroRef = useRef(null)
  const arrastandoRef = useRef(false)
  const ultima = useRef(null)

  // Mede uma vez no início do gesto. Ler o layout a cada pixel arrastado
  // fazia o navegador alternar medição e pintura, perceptível como engasgo.
  const medirLetras = () => {
    limitesRef.current = botoesRef.current.filter(Boolean).map((btn) => {
      const r = btn.getBoundingClientRect()
      return { letra: btn.dataset.letra, centro: (r.top + r.bottom) / 2 }
    })
  }

  const letraEmY = (y) => {
    const limites = limitesRef.current
    if (limites.length === 0) return null

    // A letra de centro mais próximo cobre também o pequeno espaço entre
    // botões. Antes, qualquer toque nesses intervalos caía direto em "V".
    let maisProxima = limites[0]
    let menorDistancia = Math.abs(y - maisProxima.centro)
    for (let i = 1; i < limites.length; i += 1) {
      const distancia = Math.abs(y - limites[i].centro)
      if (distancia < menorDistancia) {
        maisProxima = limites[i]
        menorDistancia = distancia
      }
    }
    return maisProxima.letra
  }

  const posicionarBolha = (y) => {
    const centroSeguro = Math.max(31, Math.min(window.innerHeight - 31, y))
    bolhaYRef.current = centroSeguro - 31
    if (quadroRef.current !== null) return
    quadroRef.current = requestAnimationFrame(() => {
      quadroRef.current = null
      bolhaRef.current?.style.setProperty('--cat-bolha-y', `${bolhaYRef.current}px`)
    })
  }

  const aplicar = (y) => {
    const letra = letraEmY(y)
    posicionarBolha(y)
    if (!letra || letra === ultima.current) return
    ultima.current = letra
    // Vibração curtíssima a cada letra nova — no Android dá a sensação de
    // "catraca" do índice nativo. O try/catch é para o Chrome, que rejeita a
    // chamada (com erro no console) enquanto a aba ainda não recebeu um toque.
    try { navigator.vibrate?.(8) } catch (_) {}
    onEscolher(letra)
  }

  const aoSoltar = useCallback(() => {
    arrastandoRef.current = false
    setArrastando(false)
    ultima.current = null
  }, [])

  const aoDescer = (e) => {
    medirLetras()
    arrastandoRef.current = true
    setArrastando(true)
    ultima.current = null
    // O Chrome recusa a captura se o ponteiro já não estiver ativo; sem o
    // try/catch o erro estourava no meio do gesto e deixava a bolha presa.
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch (_) {}
    aplicar(e.clientY)
  }
  const aoMover = (e) => {
    if (!arrastandoRef.current) return
    e.preventDefault()
    aplicar(e.clientY)
  }

  // Rede de segurança da bolha: o `pointerup` nem sempre chega à trilha —
  // dedo que sai pela borda da tela, botão do mouse solto fora da janela,
  // aba que perde o foco. Enquanto arrasta, o fim do gesto é ouvido na
  // janela inteira, então a bolha nunca fica esquecida na tela.
  useEffect(() => {
    if (!arrastando) return
    window.addEventListener('pointerup', aoSoltar)
    window.addEventListener('pointercancel', aoSoltar)
    window.addEventListener('touchend', aoSoltar)
    window.addEventListener('blur', aoSoltar)
    return () => {
      window.removeEventListener('pointerup', aoSoltar)
      window.removeEventListener('pointercancel', aoSoltar)
      window.removeEventListener('touchend', aoSoltar)
      window.removeEventListener('blur', aoSoltar)
    }
  }, [arrastando, aoSoltar])

  useEffect(() => () => {
    if (quadroRef.current !== null) cancelAnimationFrame(quadroRef.current)
  }, [])

  return (
    <>
      <div
        className="cat-trilha"
        role="navigation"
        aria-label="Índice alfabético"
        onPointerDown={aoDescer}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
        onLostPointerCapture={aoSoltar}
      >
        {letras.map((letra, i) => (
          <button
            key={letra}
            ref={(el) => { botoesRef.current[i] = el }}
            data-letra={letra}
            type="button"
            aria-label={`Ir para a letra ${letra}`}
            className={`cat-trilha__letra${letra === ativa ? ' cat-trilha__letra--ativa' : ''}`}
            onClick={(e) => {
              // Clique gerado por teclado não dispara pointerdown.
              if (e.detail === 0) onEscolher(letra)
            }}
          >
            {letra}
          </button>
        ))}
      </div>

      <div
        ref={bolhaRef}
        className={`cat-bolha${arrastando ? ' cat-bolha--visivel' : ''}`}
        aria-hidden
      >
        {ativa || letras[0]}
      </div>
    </>
  )
}
