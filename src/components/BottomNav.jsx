import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
  position: fixed;
  bottom: 2cm;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 20px 26px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 99rem;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.15),
    inset 0 1px 1px rgba(255, 255, 255, 0.3),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  touch-action: none;
  user-select: none;
`;

const Highlight = styled.div`
  position: absolute;
  top: 8px;
  bottom: 8px;
  border-radius: 99rem;
  background: rgba(0, 122, 255, 0.22);
  border: 1px solid rgba(0, 122, 255, 0.4);
  box-shadow:
    0 4px 16px rgba(0, 122, 255, 0.25),
    inset 0 1px 1px rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  pointer-events: none;
  z-index: 0;
  transition:
    left  0.42s cubic-bezier(0.34, 1.56, 0.64, 1),
    width 0.42s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

const TabButton = styled.button`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 20px 40px;
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  background: transparent;
  color: ${({ $active }) => ($active ? '#007aff' : 'rgba(255, 255, 255, 0.8)')};
  transition: color 0.25s ease, transform 0.2s ease;

  &:active { transform: scale(0.96); }

  /* Ícones em imagem (glass PNG) */
  img.tab-icon {
    width: 46px;
    height: 46px;
    object-fit: contain;
    transition: all 0.25s ease;
    /* inativo fica levemente apagado; ativo fica cheio e com brilho */
    opacity: ${({ $active }) => ($active ? 1 : 0.75)};
    filter: ${({ $active }) =>
      $active
        ? 'drop-shadow(0 2px 8px rgba(0,122,255,0.55))'
        : 'none'};
  }

  span {
    font-size: 18px;
    line-height: 1;
    font-weight: 500;
    letter-spacing: 0.3px;
  }
`;

const tabs = [
  { id: 'produtos',  label: 'Produtos',  icon: '/images/NAV-FLAT-PRODUTOS.webp'  },
  { id: 'estrutura', label: 'Estrutura', icon: '/images/NAV-FLAT-ESTRUTURA.webp' },
  { id: 'historia',  label: 'História',  icon: '/images/NAV-FLAT-EMPRESA.webp'  },
  { id: 'contato',   label: 'Contato',   icon: '/images/NAV FLAT CONTATO.webp'   },
];

const BottomNav = ({ currentScreen, onScreenChange }) => {
  const navRef  = useRef(null);
  const btnRefs = useRef([]);
  const [highlight, setHighlight] = useState({ left: 0, width: 0 });
  const [dragging, setDragging]   = useState(false);

  const activeIndex = tabs.findIndex((t) => t.id === currentScreen);

  const moveHighlightTo = useCallback((index) => {
    const btn = btnRefs.current[index];
    const nav = navRef.current;
    if (!btn || !nav) return;
    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setHighlight({ left: btnRect.left - navRect.left, width: btnRect.width });
  }, []);

  useEffect(() => {
    if (activeIndex >= 0) moveHighlightTo(activeIndex);
    const onResize = () => activeIndex >= 0 && moveHighlightTo(activeIndex);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activeIndex, moveHighlightTo]);

  const indexFromX = (clientX) => {
    for (let i = 0; i < btnRefs.current.length; i++) {
      const b = btnRefs.current[i];
      if (!b) continue;
      const r = b.getBoundingClientRect();
      if (clientX >= r.left && clientX <= r.right) return i;
    }
    return -1;
  };

  const handleDown = (clientX) => {
    setDragging(true);
    const i = indexFromX(clientX);
    if (i >= 0 && tabs[i].id !== currentScreen) onScreenChange(tabs[i].id);
  };
  const handleMove = (clientX) => {
    if (!dragging) return;
    const i = indexFromX(clientX);
    if (i >= 0 && tabs[i].id !== currentScreen) onScreenChange(tabs[i].id);
  };
  const handleUp = () => setDragging(false);

  return (
    <Nav
      ref={navRef}
      onPointerDown={(e) => handleDown(e.clientX)}
      onPointerMove={(e) => handleMove(e.clientX)}
      onPointerUp={handleUp}
      onPointerLeave={handleUp}
      onPointerCancel={handleUp}
    >
      <Highlight style={{ left: highlight.left, width: highlight.width }} />
      {tabs.map((tab, i) => (
        <TabButton
          key={tab.id}
          ref={(el) => (btnRefs.current[i] = el)}
          $active={currentScreen === tab.id}
          onClick={() => onScreenChange(tab.id)}
        >
          <img className="tab-icon" src={tab.icon} alt={tab.label} draggable={false} onDragStart={(e) => e.preventDefault()} />
          <span>{tab.label}</span>
        </TabButton>
      ))}
    </Nav>
  );
};

export default BottomNav;