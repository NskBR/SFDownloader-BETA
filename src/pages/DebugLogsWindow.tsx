import { useState, useEffect, useMemo, useRef } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { listen } from "@tauri-apps/api/event";
import {
  Bug,
  Trash2,
  Copy,
  Check,
  X,
  Minus,
  Maximize2,
  Search,
  Filter,
  AlertTriangle,
  AlertCircle,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import * as service from "../services/downloadService";
import type { DebugLogEntry } from "../services/downloadService";

export function DebugLogsWindow() {
  const [logs, setLogs] = useState<DebugLogEntry[]>([]);
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const logListRef = useRef<HTMLDivElement>(null);
  const appWindow = getCurrentWindow();

  useEffect(() => {
    void appWindow.show().catch(() => {});
    void appWindow.setFocus().catch(() => {});

    // Carrega logs iniciais
    service.getDebugLogs().then(setLogs).catch(console.error);

    // Escuta novos logs em tempo real
    const unlisten = listen<DebugLogEntry>("debug-log-entry", (event) => {
      if (event.payload) {
        setLogs((prev) => [...prev, event.payload]);
      }
    });

    return () => {
      void unlisten.then((fn) => fn());
    };
  }, []);

  useEffect(() => {
    if (autoScroll && logListRef.current) {
      logListRef.current.scrollTop = logListRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const handleClear = async () => {
    try {
      await service.clearDebugLogs();
      setLogs([]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyAll = () => {
    if (logs.length === 0) return;
    const text = logs
      .map(
        (l) =>
          `[${l.timestamp}] [${l.level.toUpperCase()}] [${l.category.toUpperCase()}] ${l.message}${
            l.targetUrl ? `\nURL: ${l.targetUrl}` : ""
          }${l.details ? `\nDetalhes:\n${l.details}` : ""}`
      )
      .join("\n\n----------------------------------------\n\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    });
  };

  const handleCopyEntry = (entry: DebugLogEntry) => {
    const text = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.category.toUpperCase()}] ${entry.message}${
      entry.targetUrl ? `\nURL: ${entry.targetUrl}` : ""
    }${entry.details ? `\nDetalhes:\n${entry.details}` : ""}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (selectedLevel !== "all" && log.level.toLowerCase() !== selectedLevel) {
        return false;
      }
      if (selectedCategory !== "all" && log.category.toLowerCase() !== selectedCategory) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const msg = (log.message || "").toLowerCase();
        const det = (log.details || "").toLowerCase();
        const url = (log.targetUrl || "").toLowerCase();
        const cat = (log.category || "").toLowerCase();
        if (!msg.includes(q) && !det.includes(q) && !url.includes(q) && !cat.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [logs, search, selectedLevel, selectedCategory]);

  const errorCount = useMemo(() => logs.filter((l) => l.level === "error").length, [logs]);
  const warnCount = useMemo(() => logs.filter((l) => l.level === "warn").length, [logs]);
  const infoCount = useMemo(() => logs.filter((l) => l.level === "info").length, [logs]);

  return (
    <div className="dbg-window">
      {/* Titlebar Customizada */}
      <header className="dbg-header" data-tauri-drag-region>
        <div className="dbg-header-left">
          <div className="dbg-header-icon">
            <Bug size={16} />
          </div>
          <div className="dbg-header-title">
            <strong>Menu Debug</strong>
            <span>Logs do Sistema & Diagnóstico</span>
          </div>
        </div>

        <div className="dbg-header-badges">
          <span className={`dbg-badge-pill error ${errorCount > 0 ? "active" : ""}`}>
            <AlertCircle size={12} />
            {errorCount} {errorCount === 1 ? "Erro" : "Erros"}
          </span>
          {warnCount > 0 && (
            <span className="dbg-badge-pill warn active">
              <AlertTriangle size={12} />
              {warnCount} {warnCount === 1 ? "Aviso" : "Avisos"}
            </span>
          )}
        </div>

        <div className="dbg-header-controls nodrag">
          <button
            type="button"
            className="dbg-ctrl-btn"
            onClick={() => void appWindow.minimize()}
            title="Minimizar"
          >
            <Minus size={14} />
          </button>
          <button
            type="button"
            className="dbg-ctrl-btn"
            onClick={() => void appWindow.toggleMaximize()}
            title="Maximizar"
          >
            <Maximize2 size={13} />
          </button>
          <button
            type="button"
            className="dbg-ctrl-btn close"
            onClick={() => void appWindow.close()}
            title="Fechar"
          >
            <X size={15} />
          </button>
        </div>
      </header>

      {/* Toolbar / Filtros */}
      <div className="dbg-toolbar">
        <div className="dbg-search-box">
          <Search size={14} className="dbg-search-icon" />
          <input
            type="text"
            placeholder="Buscar nos logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="dbg-search-input"
          />
          {search && (
            <button className="dbg-clear-search" onClick={() => setSearch("")}>
              <X size={12} />
            </button>
          )}
        </div>

        <div className="dbg-filters-row">
          <div className="dbg-level-filters">
            <button
              className={`dbg-filter-btn ${selectedLevel === "all" ? "active" : ""}`}
              onClick={() => setSelectedLevel("all")}
            >
              Todos ({logs.length})
            </button>
            <button
              className={`dbg-filter-btn error ${selectedLevel === "error" ? "active" : ""}`}
              onClick={() => setSelectedLevel("error")}
            >
              Erros ({errorCount})
            </button>
            <button
              className={`dbg-filter-btn warn ${selectedLevel === "warn" ? "active" : ""}`}
              onClick={() => setSelectedLevel("warn")}
            >
              Avisos ({warnCount})
            </button>
            <button
              className={`dbg-filter-btn info ${selectedLevel === "info" ? "active" : ""}`}
              onClick={() => setSelectedLevel("info")}
            >
              Info ({infoCount})
            </button>
          </div>

          <div className="dbg-actions-group">
            <button
              className={`dbg-btn-action ${copiedAll ? "copied" : ""}`}
              onClick={handleCopyAll}
              disabled={logs.length === 0}
              title="Copiar todos os registros formatados"
            >
              {copiedAll ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedAll ? "Copiado!" : "Copiar Tudo"}</span>
            </button>
            <button
              className="dbg-btn-action danger"
              onClick={handleClear}
              disabled={logs.length === 0}
              title="Limpar todos os registros da memória"
            >
              <Trash2 size={13} />
              <span>Limpar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Logs */}
      <main className="dbg-content" ref={logListRef}>
        {filteredLogs.length === 0 ? (
          <div className="dbg-empty-state">
            <div className="dbg-empty-icon">
              <Check size={28} />
            </div>
            <strong>Nenhum erro registrado</strong>
            <p>
              {search || selectedLevel !== "all" || selectedCategory !== "all"
                ? "Nenhum log corresponde aos filtros selecionados."
                : "Todos os downloads, conexões e serviços estão operando sem falhas."}
            </p>
          </div>
        ) : (
          <div className="dbg-log-list">
            {filteredLogs.map((log) => {
              const isExpanded = expandedIds.has(log.id);
              const isError = log.level === "error";
              const isWarn = log.level === "warn";

              return (
                <div
                  key={log.id}
                  className={`dbg-log-item level-${log.level} ${isExpanded ? "expanded" : ""}`}
                >
                  <div className="dbg-item-main" onClick={() => toggleExpand(log.id)}>
                    <div className="dbg-item-toggle">
                      {log.details || log.targetUrl ? (
                        isExpanded ? (
                          <ChevronDown size={14} />
                        ) : (
                          <ChevronRight size={14} />
                        )
                      ) : (
                        <div style={{ width: 14 }} />
                      )}
                    </div>

                    <div className="dbg-item-time">{log.timestamp}</div>

                    <span className={`dbg-level-tag ${log.level}`}>
                      {log.level.toUpperCase()}
                    </span>

                    <span className="dbg-cat-tag">{log.category}</span>

                    <div className="dbg-item-msg" title={log.message}>
                      {log.message}
                    </div>

                    <div className="dbg-item-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="dbg-item-copy-btn"
                        onClick={() => handleCopyEntry(log)}
                        title="Copiar log detalhado"
                      >
                        {copiedId === log.id ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (log.details || log.targetUrl) && (
                    <div className="dbg-item-details">
                      {log.targetUrl && (
                        <div className="dbg-detail-row">
                          <span className="dbg-detail-label">URL:</span>
                          <span className="dbg-detail-val url">{log.targetUrl}</span>
                        </div>
                      )}
                      {log.downloadId && (
                        <div className="dbg-detail-row">
                          <span className="dbg-detail-label">ID Download:</span>
                          <span className="dbg-detail-val">{log.downloadId}</span>
                        </div>
                      )}
                      {log.details && (
                        <div className="dbg-detail-block">
                          <pre>{log.details}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer com Status */}
      <footer className="dbg-footer">
        <span className="dbg-footer-status">
          Exibindo {filteredLogs.length} de {logs.length} eventos
        </span>
        <label className="dbg-auto-scroll-label">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
          />
          <span>Rolar automaticamente</span>
        </label>
      </footer>
    </div>
  );
}
