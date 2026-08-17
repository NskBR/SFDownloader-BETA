import { Minus, Square, X, Puzzle, Sparkles, ExternalLink, Settings, BarChart3, Info } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { version } from "../../../package.json";
import type { UpdateCheckResult } from "../../services/downloadService";
import { openUrl } from "../../services/downloadService";
import type { PageId } from "../../app/navigation";
import { useTranslation } from "../../i18n";

const appWindow = getCurrentWindow();

interface TitleBarProps {
  updateInfo?: UpdateCheckResult | null;
  showFooterActionsInTitleBar?: boolean;
  activePage?: PageId;
  onNavigate?: (page: PageId) => void;
  onOpenHelp?: () => void;
}

export function TitleBar({
  updateInfo,
  showFooterActionsInTitleBar,
  activePage,
  onNavigate,
  onOpenHelp,
}: TitleBarProps) {
  const { t } = useTranslation();
  const [extensionConnected, setExtensionConnected] = useState<boolean | null>(null);
  useEffect(() => {
    const updateStatus = () => {
      invoke<boolean>("browser_extension_status")
        .then(setExtensionConnected)
        .catch(() => setExtensionConnected(false));
    };
    updateStatus();
    const timer = setInterval(updateStatus, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleOpenRelease = () => {
    if (updateInfo?.release_url) {
      void openUrl(updateInfo.release_url);
    }
  };

  return (
    <header
      className="titlebar"
      data-tauri-drag-region
      onDoubleClick={() => void appWindow.toggleMaximize()}
    >
      <div className="titlebar-side" data-tauri-drag-region>
        {updateInfo?.available && (
          <button
            className="nodrag titlebar-update-badge"
            onClick={handleOpenRelease}
            title={t.titlebar.newVersionTooltip}
          >
            <Sparkles size={12} className="icon-pulse" />
            <span>{t.titlebar.newVersionAvailable}</span>
            <ExternalLink size={11} />
          </button>
        )}
      </div>
      <div className="titlebar-center" data-tauri-drag-region>
        <strong>{t.titlebar.title}</strong>
        <span className="titlebar-version">v{version}</span>
      </div>
      <div className="titlebar-side titlebar-actions" data-tauri-drag-region>
        {showFooterActionsInTitleBar && (
          <div className="nodrag titlebar-footer-actions">
            <button
              className={`titlebar-theme-btn ${activePage === "settings" ? "active" : ""}`}
              onClick={() => onNavigate?.("settings")}
              title={t.sidebar.settings}
            >
              <Settings size={16} />
            </button>
            <button
              className={`titlebar-theme-btn ${activePage === "metrics" ? "active" : ""}`}
              onClick={() => onNavigate?.("metrics")}
              title={t.sidebar.metrics}
            >
              <BarChart3 size={16} />
            </button>
            <button
              className="titlebar-theme-btn"
              onClick={() => onOpenHelp?.()}
              title={t.sidebar.about}
            >
              <Info size={16} />
            </button>
          </div>
        )}

        <div className="nodrag titlebar-integration">
          <button
            className="titlebar-theme-btn"
            onClick={() => void invoke("open_browser_integration_window").catch(console.error)}
            title={`${t.titlebar.browserIntegration} — ${extensionConnected ? t.titlebar.extensionConnected : t.titlebar.extensionDisconnected}`}
          >
            <Puzzle size={16} />
            <span
              className={`sidebar-status-dot ${extensionConnected ? "connected" : "disconnected"}`}
              aria-hidden="true"
            />
          </button>
        </div>
        <div className="window-controls nodrag">
          <button
            aria-label={t.titlebar.minimizeTooltip}
            title={t.titlebar.minimizeTooltip}
            onClick={() => void appWindow.minimize()}
          >
            <Minus size={17} />
          </button>
          <button
            aria-label={t.titlebar.maximizeTooltip}
            title={t.titlebar.maximizeTooltip}
            onClick={() => void appWindow.toggleMaximize()}
          >
            <Square size={14} />
          </button>
          <button
            className="window-close"
            aria-label={t.titlebar.closeTooltip}
            title={t.titlebar.closeTooltip}
            onClick={() => void appWindow.close()}
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
