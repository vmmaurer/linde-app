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
  const [bolhaY, setBolhaY] = useState(0)
  const botoesRef = useRef([])
  const ultima = useRef(null)

  const letraEmY = (y) => {
    const botoes = botoesRef.current.filter(Boolean)
    if (botoes.length === 0) return null

    for (const btn of botoes) {
      const r = btn.getBoundingClientRect()
      if (y >= r.top && y <= r.bottom) return btn.dataset.letra
    }
    // Fora da barra (dedo escorregou para cima/baixo): trava nas pontas.
    const primeira = botoes[0].getBoundingClientRect()
    if (y < primeira.top) return botoes[0].dataset.letra
    return botoes[botoes.length - 1].dataset.letra
  }

  const aplicar = (y) => {
    const letra = letraEmY(y)
    setBolhaY(y)
    if (!letra || letra === ultima.current) return
    ultima.current = letra
    // Vibração curtíssima a cada letra nova — no Android dá a sensação de
    // "catraca" do índice nativo. O try/catch é para o Chrome, que rejeita a
    // chamada (com erro no console) enquanto a aba ainda não recebeu um toque.
    try { navigator.vibrate?.(8) } catch (_) {}
    onEscolher(letra)
  }

  const aoSoltar = useCallback(() => {
    setArrastando(false)
    ultima.current = null
  }, [])

  const aoDescer = (e) => {
    setArrastando(true)
    ultima.current = null
    // O Chrome recusa a captura se o ponteiro já não estiver ativo; sem o
    // try/catch o erro estourava no meio do gesto e deixava a bolha presa.
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch (_) {}
    aplicar(e.clientY)
  }
  const aoMover = (e) => {
    if (!arrastando) return
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
          >
            {letra}
          </button>
        ))}
      </div>

      {arrastando && (
        <div className="cat-bolha" style={{ top: bolhaY }} aria-hidden>
          {ativa}
        </div>
      )}
    </>
  )
}
