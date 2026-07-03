import { useState, useRef, useId, type ReactNode, type KeyboardEvent } from 'react';

export interface TabDef {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: TabDef[];
  defaultTab?: string;
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultTab ?? tabs[0]?.id ?? '');
  const uid = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function tabId(id: string) { return `${uid}-tab-${id}`; }
  function panelId(id: string) { return `${uid}-panel-${id}`; }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    else return;
    e.preventDefault();
    setActiveId(tabs[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <div role="tablist" style={{ display: 'flex', borderBottom: 'var(--border-width-base) solid var(--border-subtle)' }}>
        {tabs.map((tab, i) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              id={tabId(tab.id)}
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId(tab.id)}
              tabIndex={isActive ? 0 : -1}
              ref={el => { tabRefs.current[i] = el; }}
              onClick={() => setActiveId(tab.id)}
              onKeyDown={e => handleKeyDown(e, i)}
              style={{
                position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '10px 16px 0', background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-base)', fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--action-primary)' : 'var(--text-subtle)',
                gap: 0,
              }}
            >
              <span style={{ paddingBottom: 10 }}>{tab.label}</span>
              <span aria-hidden="true" style={{ display: 'block', height: 2, width: '100%', background: isActive ? 'var(--action-primary)' : 'transparent', marginBottom: -1, borderRadius: '1px 1px 0 0' }} />
            </button>
          );
        })}
      </div>
      {tabs.map(tab => (
        <div key={tab.id} id={panelId(tab.id)} role="tabpanel" aria-labelledby={tabId(tab.id)} hidden={tab.id !== activeId} style={{ padding: 'var(--space-5) 0' }}>
          {tab.content}
        </div>
      ))}
    </div>
  );
}
