import React, { useState } from 'react'
import MidiaSwipe from './MidiaSwipe'
import { Chevron, Documento, Marcador } from './icones'

/**
 * Tela cheia de um produto: fotos, subtítulo, descrição, aplicações e,
 * para quem tem, a ficha técnica — tudo vindo de products.js.
 *
 * A ordem segue a conversa do vendedor: primeiro a foto (é o que ele vira
 * para o cliente ver), depois o nome, depois o porquê, depois onde usar.
 */
export default function ProdutoDetalhe({ produto, onVoltar, onAbrirFicha, temFicha }) {
  const [indiceMidia, setIndiceMidia] = useState(0)

  // Desempate: se o produto não tiver a lista `media`,
  // cai para o vídeo/imagem avulsos do card.
  let midias = produto.media
  if (!midias || midias.length === 0) {
    midias = []
    if (produto.modalVideo) midias.push({ type: 'video', src: produto.modalVideo })
    if (produto.modalImage) midias.push({ type: 'image', src: produto.modalImage })
  }

  // Legenda da foto atual (as seis linhas do Habitat). Só as mídias que
  // trazem `caption` mostram algo.
  const legenda = midias[indiceMidia]?.caption || null

  return (
    <div className="cat-detalhe">
      <div className="cat-detalhe__barra">
        <button type="button" className="cat-voltar" onClick={onVoltar}>
          <Chevron size={16} dir="esquerda" cor="#f0c832" />
          Catálogo
        </button>

        {produto.brandLogo && (
          <img className="cat-detalhe__marca" src={produto.brandLogo} alt="" draggable={false} />
        )}
      </div>

      <div className="cat-detalhe__rolagem">
        <MidiaSwipe midias={midias} onIndice={setIndiceMidia} />

        <div className="cat-detalhe__corpo">
          <p className="cat-detalhe__eyebrow">{produto.subtitle}</p>
          <h1 className="cat-detalhe__titulo">{produto.title}</h1>

          {legenda && (
            <div className="cat-legenda" key={legenda}>
              <span className="cat-legenda__barra" aria-hidden />
              <span className="cat-legenda__txt">{legenda}</span>
            </div>
          )}

          <p className="cat-detalhe__desc">{produto.description}</p>

          <div className="cat-bloco">
            <h2 className="cat-bloco__titulo">{produto.applicationsTitle || 'Aplicações'}</h2>
            <div className="cat-aplic">
              {produto.applications.map((app) => (
                <div className="cat-aplic__item" key={app}>
                  <Marcador size={16} />
                  <span>{app}</span>
                </div>
              ))}
            </div>
          </div>

          {temFicha && (
            <button type="button" className="cat-ficha-btn" onClick={onAbrirFicha}>
              <Documento size={18} />
              Ficha Técnica
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
