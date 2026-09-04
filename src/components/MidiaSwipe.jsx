import React, { useEffect, useRef, useState } from 'react'
import { Estrela } from './icones'

/**
 * Carrossel de fotos/vídeos do produto.
 *
 * O gesto é o swipe: nada de setas cobrindo a foto num aparelho onde a tela
 * inteira já é o botão. As vizinhas só são buscadas com a atual parada — o
 * vendedor está no 4G do cliente, e puxar as sete fotos de uma vez atrasaria
 * justamente a primeira, que é a que ele precisa mostrar.
 *
 * Lê os campos que products.js já traz: type, src, position, caption e badge.
 */
export default function MidiaSwipe({ midias, altura = '46dvh', onIndice }) {
  const [indice, setIndice] = useState(0)
  const inicioX = useRef(null)
  const inicioY = useRef(null)
  const deslizando = useRef(false)
  const total = midias.length

  // Busca a foto anterior e a próxima enquanto a atual está parada na tela.
  // Assim o swipe troca a imagem no mesmo gesto, em vez de piscar cinza.
  useEffect(() => {
    if (total < 2) return
    const vizinhas = [indice + 1, indice - 1]
      .map((i) => midias[((i % total) + total) % total])
      .filter((m) => m && m.type === 'image')
    const imgs = vizinhas.map((m) => {
      const img = new Image()
      img.src = m.src
      return img
    })
    return () => imgs.forEach((img) => { img.src = '' })
  }, [indice, midias, total])

  const ir = (i) => {
    const alvo = ((i % total) + total) % total
    setIndice(alvo)
    onIndice?.(alvo)
  }

  const aoDescer = (e) => {
    inicioX.current = e.clientX
    inicioY.current = e.clientY
    deslizando.current = true
  }
  const aoMover = (e) => {
    if (!deslizando.current || inicioX.current === null) return
    const dx = e.clientX - inicioX.current
    const dy = e.clientY - (inicioY.current ?? e.clientY)
    // Só assume o gesto como horizontal quando ele é claramente horizontal —
    // caso contrário o dedo que queria rolar a página ficaria preso na foto.
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) e.preventDefault()
  }
  const aoSoltar = (e) => {
    if (!deslizando.current || inicioX.current === null) {
      deslizando.current = false
      return
    }
    const dx = e.clientX - inicioX.current
    const dy = e.clientY - (inicioY.current ?? e.clientY)
    // Um arrasto vertical pode terminar alguns pixels para o lado. Exigir
    // predominância horizontal evita trocar a foto quando a intenção era
    // apenas rolar o conteúdo do produto.
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.15) {
      ir(dx < 0 ? indice + 1 : indice - 1)
    }
    deslizando.current = false
    inicioX.current = null
    inicioY.current = null
  }

  const item = midias[indice]
  if (!item) return null

  return (
    <div
      className="cat-midia"
      style={{ '--cat-midia-altura': altura }}
      onPointerDown={aoDescer}
      onPointerMove={aoMover}
      onPointerUp={aoSoltar}
      onPointerCancel={aoSoltar}
    >
      {item.type === 'video' ? (
        <video
          key={item.src}
          src={item.src}
          className="cat-midia__quadro"
          style={{ objectPosition: item.position || 'center' }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          draggable={false}
          disablePictureInPicture
          controlsList="nodownload noplaybackrate"
          onContextMenu={(e) => e.preventDefault()}
        />
      ) : (
        <img
          key={item.src}
          src={item.src}
          alt=""
          className="cat-midia__quadro"
          style={{ objectPosition: item.position || 'center' }}
          draggable={false}
          decoding="async"
          onDragStart={(e) => e.preventDefault()}
        />
      )}

      {/* Selo da mídia — só quem tem `badge` mostra (hoje o Habitat Neutro Bronze) */}
      {item.badge && (
        <div key={`selo-${item.src}`} className="cat-midia__selo">
          <Estrela size={13} />
          <span>{item.badge}</span>
        </div>
      )}

      <div className="cat-midia__veu" />

      {total > 1 && (
        <>
          <span className="cat-midia__contador">
            {indice + 1}/{total}
          </span>

          <div className="cat-midia__pontos">
            {midias.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Mídia ${i + 1} de ${total}`}
                className={`cat-midia__ponto${i === indice ? ' cat-midia__ponto--ativo' : ''}`}
                onPointerDown={(e) => { e.stopPropagation(); ir(i) }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
