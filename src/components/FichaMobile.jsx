import React, { useState } from 'react'
import { Xis } from './icones'

/**
 * Ficha técnica no celular.
 *
 * Os números vêm de src/data/fichaTecnica.js. A ficha da Cebrace tem oito
 * colunas de espessura (4 monolíticas + 4 laminadas); lado a lado elas pedem
 * 740px, o que num celular vira rolagem horizontal e faz o vendedor perder a
 * linha que estava lendo. Aqui o alternador Monolítico/Laminados troca as
 * quatro colunas de cima, e cada vidro fica num bloco do tamanho da tela.
 */
export default function FichaMobile({ ficha, onFechar }) {
  const [linhaAtiva, setLinhaAtiva] = useState(0)
  const [tipo, setTipo] = useState('mono') // 'mono' | 'lam'

  if (!ficha) return null

  const linha = ficha.linhas[linhaAtiva]
  const espessuras = ficha.colunas[tipo]
  const qtdLinhas = ficha.linhas.length

  return (
    <div className="cat-ficha" role="dialog" aria-label={`${ficha.eyebrow} — ${ficha.titulo}`}>
      {/* ── Cabeçalho ── */}
      <div className="cat-ficha__topo">
        <button
          type="button"
          className="cat-ficha__fechar"
          aria-label="Fechar ficha técnica"
          onClick={onFechar}
        >
          <Xis size={14} />
        </button>

        <p className="cat-ficha__eyebrow">{ficha.eyebrow}</p>
        <h2 className="cat-ficha__titulo">{ficha.titulo}</h2>
        {ficha.brandLogo && (
          <img className="cat-ficha__logo" src={ficha.brandLogo} alt="" draggable={false} />
        )}

        {/* Neutro / Refletivo */}
        <div
          className="cat-seg"
          style={{ gridTemplateColumns: `repeat(${qtdLinhas}, 1fr)`, maxWidth: 340 }}
        >
          <div
            aria-hidden
            className="cat-seg__pilula"
            style={{
              width: `calc((100% - 8px - ${(qtdLinhas - 1) * 4}px) / ${qtdLinhas})`,
              transform: `translateX(calc(${linhaAtiva} * (100% + 4px)))`,
              background: `linear-gradient(145deg, ${linha.accent}2e 0%, rgba(35,60,100,0.9) 100%)`,
              boxShadow: `0 6px 18px rgba(0,0,0,0.4), 0 0 20px ${linha.accent}33`,
            }}
          />
          {ficha.linhas.map((l, i) => (
            <button
              key={l.id}
              type="button"
              className="cat-seg__btn"
              aria-pressed={i === linhaAtiva}
              style={{
                color: i === linhaAtiva ? '#f0f0f0' : 'rgba(240,240,240,0.5)',
                fontWeight: i === linhaAtiva ? 700 : 500,
              }}
              onClick={() => setLinhaAtiva(i)}
            >
              {l.label}
            </button>
          ))}
        </div>

        <p className="cat-ficha__resumo">
          <span key={linha.id} style={{ display: 'inline-block' }}>{linha.resumo}</span>
        </p>
      </div>

      {/* ── Blocos da linha ativa ── */}
      <div className="cat-ficha__rolagem" key={linha.id}>
        {/* Monolítico / Laminados vale para todos os vidros da linha */}
        <div className="cat-tipo cat-tipo--geral">
          <button
            type="button"
            className={`cat-tipo__btn${tipo === 'mono' ? ' cat-tipo__btn--ativo' : ''}`}
            aria-pressed={tipo === 'mono'}
            onClick={() => setTipo('mono')}
          >
            Monolítico
          </button>
          <button
            type="button"
            className={`cat-tipo__btn${tipo === 'lam' ? ' cat-tipo__btn--ativo' : ''}`}
            aria-pressed={tipo === 'lam'}
            onClick={() => setTipo('lam')}
          >
            Laminados
          </button>
        </div>

        {linha.vidros.map((vidro) => (
          <BlocoVidro key={vidro.nome} vidro={vidro} tipo={tipo} espessuras={espessuras} />
        ))}

        {linha.nota && <p className="cat-ficha__nota">{linha.nota}</p>}
      </div>
    </div>
  )
}

/** Um vidro = swatch + nome + tabela métricas × espessuras. */
function BlocoVidro({ vidro, tipo, espessuras }) {
  // As métricas já vêm rotuladas por grupo ("Fatores Luminosos" / "Fatores
  // de Energia"); aqui só juntamos as vizinhas para virar um cabeçalho.
  const grupos = []
  vidro.metricas.forEach((m) => {
    const ultimo = grupos[grupos.length - 1]
    if (ultimo && ultimo.nome === m.grupo) ultimo.itens.push(m)
    else grupos.push({ nome: m.grupo, itens: [m] })
  })

  return (
    <section className="cat-vidro" style={{ '--cat-vidro-accent': vidro.accent }}>
      <div
        className="cat-vidro__nome"
        style={{ background: `linear-gradient(90deg, ${vidro.accent}26 0%, rgba(35,60,100,0.18) 100%)` }}
      >
        <span
          className="cat-vidro__swatch"
          style={{ background: `linear-gradient(140deg, ${vidro.tint[0]} 0%, ${vidro.tint[1]} 100%)` }}
        />
        {vidro.nome}
      </div>

      <div className="cat-tabela-rolagem">
        <table className="cat-tabela">
          <caption className="sr-only">
            Desempenho técnico de {vidro.nome} em diferentes espessuras
          </caption>
          <thead>
            <tr>
              <th scope="col" className="cat-tabela__metrica cat-tabela__metrica--cabecalho">
                Indicador
              </th>
              {espessuras.map((e) => (
                <th scope="col" key={e} className="cat-tabela__esp" style={{ color: vidro.accent }}>
                  {e}
                </th>
              ))}
            </tr>
          </thead>

          {grupos.map((g) => (
            <tbody key={g.nome}>
              <tr className="cat-tabela__grupo">
                <th colSpan={espessuras.length + 1} style={{ color: vidro.accent }}>
                  {g.nome}
                </th>
              </tr>
              {g.itens.map((m) => {
                const valor = m[tipo]
                return (
                  <tr key={m.abbr + m.label}>
                    <th scope="row" className="cat-tabela__metrica">
                      {m.label}
                      <span className="cat-tabela__abbr">{m.abbr}</span>
                    </th>
                    {/* valor em array = um por espessura; string = vale para todas */}
                    {Array.isArray(valor) ? (
                      valor.map((v, i) => (
                        <td key={i} className="cat-tabela__valor">{v}</td>
                      ))
                    ) : (
                      <td className="cat-tabela__valor" colSpan={espessuras.length}>
                        {valor}
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          ))}
        </table>
      </div>
    </section>
  )
}
