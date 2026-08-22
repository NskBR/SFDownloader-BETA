import {
  Plus,
  Tags,
  Trash2,
  Globe,
  Palette,
  Download,
  Folder,
  Settings2,
  Gauge,
  Sliders,
  Play,
  Package,
  FileText,
  Info,
  CheckCircle,
  Pencil,
  Check,
  Sparkles,
  Dices,
  HardDrive,
  Bot,
  Bug,
} from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { AppLanguage, AppSettings, AccentColor, AppColor } from "../domain/settings";
import { downloadCategories } from "../domain/categories";
import {
  chooseDownloadFolder,
  createCategoryFolders,
} from "../services/folderService";
import { isLaunchOnStartup, setLaunchOnStartup } from "../services/downloadService";
import { Toggle } from "../components/ui/Toggle";
import { CustomSelect } from "../components/ui/CustomSelect";
import { ThemeCustomizerModal } from "../components/ui/DiscordThemeCustomizer";
import { useTranslation } from "../i18n";

type SettingsTab = "personalizacao" | "downloads" | "arquivos" | "idioma" | "avancado";

interface Props {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  saved: boolean;
  onBack: () => void;
}

export function SettingsPage({ settings, onSave, saved }: Props) {
  const { t, setLanguage } = useTranslation();
  const [draft, setDraft] = useState(settings);
  const [activeTab, setActiveTab] = useState<SettingsTab>("downloads");
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");

  const navTabsRef = useRef<HTMLElement | null>(null);
  const [tabsIndicator, setTabsIndicator] = useState<{ left: number; width: number; height: number; visible: boolean }>({
    left: 0,
    width: 0,
    height: 0,
    visible: false,
  });

  useLayoutEffect(() => {
    const nav = navTabsRef.current;
    if (!nav) return;

    const updateIndicator = () => {
      const activeBtn = nav.querySelector<HTMLElement>(".cfg-tab-btn.is-active");
      if (!activeBtn) {
        setTabsIndicator((prev) => ({ ...prev, visible: false }));
        return;
      }
      const navRect = nav.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      setTabsIndicator({
        left: btnRect.left - navRect.left,
        width: btnRect.width,
        height: btnRect.height,
        visible: true,
      });
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    const ro = new ResizeObserver(updateIndicator);
    ro.observe(nav);

    return () => {
      window.removeEventListener("resize", updateIndicator);
      ro.disconnect();
    };
  }, [activeTab]);
  const [categoryExtensions, setCategoryExtensions] = useState("");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editExts, setEditExts] = useState("");
  const [customizerModalOpen, setCustomizerModalOpen] = useState(false);

  const appThemes = [
    {
      id: "custom",
      name: "Personalizado",
      bg: "linear-gradient(135deg, #1d2028, #111319)",
      accent: "#06b6d4",
      isGradient: true,
      stops: null,
    },
    {
      id: "midnight-sapphire",
      name: "Azul neon",
      bg: "linear-gradient(135deg, #0b1638, #040714)",
      accent: "#3b82f6",
      isGradient: true,
      stops: ["#0b1638", "#040714"],
    },
    {
      id: "cyberpunk-violet",
      name: "Roxo gradiente",
      bg: "linear-gradient(135deg, #320938, #050a1e)",
      accent: "#8b5cf6",
      isGradient: true,
      stops: ["#320938", "#050a1e"],
    },
    {
      id: "high-contrast",
      name: "Alto contraste",
      bg: "linear-gradient(135deg, #0a0c10, #040507)",
      accent: "#eab308",
      isGradient: true,
      stops: ["#0a0c10", "#040507"],
    },
    {
      id: "crimson-void",
      name: "Carmim Obscuro",
      bg: "linear-gradient(135deg, #41010d, #080204)",
      accent: "#ef4444",
      isGradient: true,
      stops: ["#41010d", "#080204"],
    },
    {
      id: "emerald-dusk",
      name: "Crepúsculo Esmeralda",
      bg: "linear-gradient(135deg, #0a2818, #040d08)",
      accent: "#10b981",
      isGradient: true,
      stops: ["#0a2818", "#040d08"],
    },
  ];

  const getSelectedThemeId = (): string => {
    if (draft.interfaceGradient.enabled) {
      const firstStop = draft.interfaceGradient.stops[0]?.color.toLowerCase() || "";
      if (firstStop === "#0b1638") return "midnight-sapphire";
      if (firstStop === "#320938") return "cyberpunk-violet";
      if (firstStop === "#0a0c10") return "high-contrast";
      if (firstStop === "#41010d") return "crimson-void";
      if (firstStop === "#0a2818") return "emerald-dusk";
      return "custom";
    }
    return "slate";
  };

  const selectedThemeId = getSelectedThemeId();

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const next = { ...draft, [key]: value };
    setDraft(next);
    if (next.rootDownloadFolder.trim()) void save(next);
    else setError("Escolha a pasta principal de downloads.");
  };

  useEffect(() => {
    void isLaunchOnStartup()
      .then((enabled) => setDraft((current) => ({ ...current, launchOnStartup: enabled })))
      .catch(() => {});
  }, []);

  const save = async (next: AppSettings) => {
    setError(null);
    try {
      if (next.autoOrganizeEnabled)
        await createCategoryFolders(
          next.rootDownloadFolder,
          next.customCategories.map((category) => category.name),
        );
      onSave(next);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível salvar as configurações.",
      );
    }
  };

  const openBrowserIntegration = () => {
    void invoke("open_browser_integration_window").catch(console.error);
  };

  const openDebugWindow = () => {
    void invoke("open_debug_window").catch(console.error);
  };

  const selectFolder = async () => {
    setError(null);
    try {
      const folder = await chooseDownloadFolder();
      if (folder) update("rootDownloadFolder", folder);
    } catch {
      setError("Não foi possível abrir o seletor de pastas.");
    }
  };

  const selectSecondaryFolder = async () => {
    setError(null);
    try {
      const folder = await chooseDownloadFolder();
      if (folder) {
        const next = {
          ...draft,
          secondaryDownloadFolder: folder,
          secondaryFolderEnabled: true,
        };
        setDraft(next);
        void save(next);
      }
    } catch {
      setError("Não foi possível abrir o seletor de pastas.");
    }
  };

  const addCategory = () => {
    const name = categoryName.trim();
    if (!name || /[<>:"/\\|?*]/.test(name) || name === "." || name === "..") {
      setError("Informe um nome de categoria válido, sem caracteres de caminho.");
      return;
    }
    const names = [
      ...downloadCategories.map((category) => category.name),
      ...draft.customCategories.map((category) => category.name),
    ];
    if (names.some((current) => current.toLowerCase() === name.toLowerCase())) {
      setError("Já existe uma categoria com esse nome.");
      return;
    }
    const extensions = [
      ...new Set(
        categoryExtensions
          .split(/[\s,;]+/)
          .map((extension) => extension.replace(/^\./, "").toLowerCase())
          .filter((extension) => /^[a-z0-9]+$/.test(extension)),
      ),
    ];
    update("customCategories", [
      ...draft.customCategories,
      { id: crypto.randomUUID(), name, extensions },
    ]);
    setCategoryName("");
    setCategoryExtensions("");
    setError(null);
  };

  const removeCategory = (id: string) =>
    update(
      "customCategories",
      draft.customCategories.filter((category) => category.id !== id),
    );

  const startEditCategory = (cat: { id: string; name: string; extensions: string[] }) => {
    setEditingCatId(cat.id);
    setEditName(cat.name);
    setEditExts(Array.isArray(cat.extensions) ? cat.extensions.join(", ") : "");
  };

  const saveEditCategory = (id: string) => {
    const name = editName.trim();
    if (!name) return;
    const extensions = Array.from(
      new Set(
        editExts
          .split(/[\s,;]+/)
          .map((ext) => ext.replace(/^\./, "").toLowerCase())
          .filter((ext) => /^[a-z0-9]+$/.test(ext)),
      ),
    );
    const next = draft.customCategories.map((c) =>
      c.id === id ? { ...c, name, extensions } : c,
    );
    update("customCategories", next);
    setEditingCatId(null);
  };

  const tabs = [
    { id: "personalizacao", label: t.settings.tabs.personalization, icon: <Palette size={16} /> },
    { id: "downloads", label: t.settings.tabs.downloads, icon: <Download size={16} /> },
    { id: "arquivos", label: t.settings.tabs.files, icon: <Folder size={16} /> },
    { id: "idioma", label: t.settings.tabs.language, icon: <Globe size={16} /> },
    { id: "avancado", label: t.settings.tabs.advanced, icon: <Settings2 size={16} /> },
  ];

  return (
    <section className="cfg-container">
      {/* Cabeçalho da Página */}
      <header className="cfg-header">
        <div>
          <h1 className="cfg-title">{t.settings.title}</h1>
          <p className="cfg-subtitle">{t.settings.subtitle}</p>
        </div>
        {saved && <span className="cfg-autosave">{t.settings.autoSaved}</span>}
      </header>

      {error && <div className="error-banner">{error}</div>}

      {/* Navegação por Abas Horizontais */}
      <nav
        className={`cfg-nav-tabs ${draft.sidebarAnimation !== false ? "" : "cfg-nav-tabs--no-animation"}`}
        ref={navTabsRef}
      >
        <span
          className="cfg-tabs-indicator"
          style={{
            transform: `translateX(${tabsIndicator.left}px)`,
            width: tabsIndicator.width,
            height: tabsIndicator.height,
            opacity: tabsIndicator.visible ? 1 : 0,
          }}
          aria-hidden="true"
        />
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`cfg-tab-btn ${isActive ? "is-active" : ""}`}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
            >
              <span className="cfg-tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Conteúdo da Aba Ativa */}
      <div className="cfg-tab-content">
        {/* ABA: DOWNLOADS */}
        {activeTab === "downloads" && (
          <div className="cfg-tab-view">
            <div className="cfg-grid-2col">
              {/* Coluna da Esquerda */}
              <div className="cfg-col">
                {/* 1. Local de download */}
                <div className="cfg-card">
                  <div className="cfg-card-header">
                    <div className="cfg-card-icon-box">
                      <Folder className="cfg-card-icon" size={20} />
                    </div>
                    <div>
                      <h3 className="cfg-card-title">{t.settings.downloadsTab.downloadLocationTitle}</h3>
                      <p className="cfg-card-subtitle">{t.settings.downloadsTab.downloadLocationSubtitle}</p>
                    </div>
                  </div>

                  <div className="cfg-card-content" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div>
                      <span className="cfg-item-label" style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "4px", display: "block" }}>{t.settings.downloadsTab.mainDefaultFolder}</span>
                      <div className="cfg-path-input-row">
                        <div className="cfg-path-display" title={draft.rootDownloadFolder}>
                          {draft.rootDownloadFolder || t.settings.downloadsTab.selectFolderPlaceholder}
                        </div>
                        <button type="button" className="cfg-btn-alterar" onClick={selectFolder}>
                          <Folder size={15} />
                          <span>{t.settings.downloadsTab.changeFolder}</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="cfg-item-label" style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "4px", display: "block" }}>{t.settings.downloadsTab.secondaryDefaultFolder}</span>
                      <div className="cfg-path-input-row">
                        <div className="cfg-path-display" title={draft.secondaryDownloadFolder}>
                          {draft.secondaryDownloadFolder || t.settings.downloadsTab.noSecondaryFolder}
                        </div>
                        <button type="button" className="cfg-btn-alterar" onClick={selectSecondaryFolder}>
                          <HardDrive size={15} />
                          <span>{draft.secondaryDownloadFolder ? t.settings.downloadsTab.changeFolder : t.settings.downloadsTab.configureFolder}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Limite de velocidade */}
                <div className="cfg-card">
                  <div className="cfg-card-header">
                    <div className="cfg-card-icon-box">
                      <Gauge className="cfg-card-icon" size={20} />
                    </div>
                    <div>
                      <h3 className="cfg-card-title">{t.settings.downloadsTab.speedLimitTitle}</h3>
                      <p className="cfg-card-subtitle">{t.settings.downloadsTab.speedLimitSubtitle}</p>
                    </div>
                  </div>

                  <div className="cfg-card-content cfg-list-items">
                    <div className="cfg-item-row">
                      <div className="cfg-item-left">
                        <Gauge size={18} className="cfg-item-icon" />
                        <div>
                          <strong className="cfg-item-label">{t.settings.downloadsTab.presetLimitLabel}</strong>
                          <span className="cfg-item-desc">{t.settings.downloadsTab.presetLimitDesc}</span>
                        </div>
                      </div>
                      <div className="cfg-item-right">
                        <CustomSelect
                          value={draft.speedLimitText || t.settings.downloadsTab.noLimit}
                          options={[
                            { value: t.settings.downloadsTab.noLimit, label: t.settings.downloadsTab.noLimit },
                            { value: "1 MB/s", label: "1 MB/s" },
                            { value: "5 MB/s", label: "5 MB/s" },
                            { value: "10 MB/s", label: "10 MB/s" },
                            { value: "25 MB/s", label: "25 MB/s" },
                            { value: "50 MB/s", label: "50 MB/s" },
                          ]}
                          onChange={(val) => update("speedLimitText", val)}
                        />
                      </div>
                    </div>

                    <div className="cfg-item-row">
                      <div className="cfg-item-left">
                        <Sliders size={18} className="cfg-item-icon" />
                        <div>
                          <strong className="cfg-item-label">{t.settings.downloadsTab.customSpeedLabel}</strong>
                          <span className="cfg-item-desc">{t.settings.downloadsTab.customSpeedDesc}</span>
                        </div>
                      </div>
                      <div className="cfg-item-right">
                        <input
                          type="text"
                          className="cfg-path-display"
                          style={{ width: "110px", height: "32px", textAlign: "center" }}
                          value={draft.speedLimitText || ""}
                          placeholder={t.settings.downloadsTab.customSpeedPlaceholder}
                          onChange={(e) => update("speedLimitText", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coluna da Direita */}
              <div className="cfg-col">
                {/* 3. Comportamento do download */}
                <div className="cfg-card">
                  <div className="cfg-card-header">
                    <div className="cfg-card-icon-box">
                      <Sliders className="cfg-card-icon" size={20} />
                    </div>
                    <div>
                      <h3 className="cfg-card-title">{t.settings.downloadsTab.downloadBehaviorTitle}</h3>
                      <p className="cfg-card-subtitle">{t.settings.downloadsTab.downloadBehaviorSubtitle}</p>
                    </div>
                  </div>

                  <div className="cfg-card-content cfg-list-items">
                    <div className="cfg-item-row">
                      <div className="cfg-item-left">
                        <Play size={18} className="cfg-item-icon" />
                        <div>
                          <strong className="cfg-item-label">{t.settings.downloadsTab.autoStartLabel}</strong>
                          <span className="cfg-item-desc">{t.settings.downloadsTab.autoStartDesc}</span>
                        </div>
                      </div>
                      <div className="cfg-item-right">
                        <Toggle
                          checked={draft.autoStartDownloads ?? true}
                          onChange={(val) => update("autoStartDownloads", val)}
                        />
                      </div>
                    </div>

                    <div className="cfg-item-row">
                      <div className="cfg-item-left">
                        <Package size={18} className="cfg-item-icon" />
                        <div>
                          <strong className="cfg-item-label">{t.settings.downloadsTab.autoExtractLabel}</strong>
                          <span className="cfg-item-desc">{t.settings.downloadsTab.autoExtractDesc}</span>
                        </div>
                      </div>
                      <div className="cfg-item-right">
                        <Toggle
                          checked={draft.deleteArchiveAfterExtract}
                          onChange={(val) => update("deleteArchiveAfterExtract", val)}
                        />
                      </div>
                    </div>

                    <div className="cfg-item-row">
                      <div className="cfg-item-left">
                        <Folder size={18} className="cfg-item-icon" />
                        <div>
                          <strong className="cfg-item-label">{t.settings.downloadsTab.openOnCompleteLabel}</strong>
                          <span className="cfg-item-desc">{t.settings.downloadsTab.openOnCompleteDesc}</span>
                        </div>
                      </div>
                      <div className="cfg-item-right">
                        <Toggle
                          checked={draft.openFolderOnComplete ?? false}
                          onChange={(val) => update("openFolderOnComplete", val)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Banner Dica */}
                <div className="cfg-tip-banner">
                  <div className="cfg-tip-left">
                    <div className="cfg-tip-info-icon">
                      <Info size={24} />
                    </div>
                    <div>
                      <strong className="cfg-tip-title">{t.settings.downloadsTab.tipTitle}</strong>
                      <p className="cfg-tip-desc">
                        {t.settings.downloadsTab.tipDesc}
                      </p>
                    </div>
                  </div>
                  <div className="cfg-tip-badge">
                    <div className="cfg-tip-graphic">
                      <CheckCircle size={28} className="cfg-tip-check" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA: PERSONALIZAÇÃO */}
        {activeTab === "personalizacao" && (
          <div className="cfg-tab-view">
            {/* Card 1: Tema do aplicativo (6 Temas) */}
            <div className="cfg-card">
              <div className="cfg-card-header cfg-theme-header">
                <div>
                  <h3 className="cfg-card-title">{t.settings.personalization.appThemeTitle}</h3>
                  <p className="cfg-card-subtitle">{t.settings.personalization.appThemeSubtitle}</p>
                </div>
              </div>

              <div className="cfg-card-content">
                <div className="cfg-themes-grid">
                  {appThemes.map((theme) => {
                    const isSelected = selectedThemeId === theme.id;

                    return (
                      <button
                        key={theme.id}
                        type="button"
                        className={`cfg-theme-tile ${isSelected ? "is-selected" : ""}`}
                        onClick={() => {
                          if (theme.id === "custom") {
                            setCustomizerModalOpen(true);
                          } else if (theme.isGradient && theme.stops) {
                            const next = {
                              ...draft,
                              interfaceGradient: {
                                enabled: true,
                                type: "linear" as const,
                                angle: 135,
                                intensity: 75,
                                stops: [
                                  { color: theme.stops[0], position: 0 },
                                  { color: theme.stops[1], position: 100 },
                                ],
                              },
                            };
                            setDraft(next);
                            onSave(next);
                          }
                        }}
                      >
                        {isSelected && (
                          <div className="cfg-theme-check-badge">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}

                        {/* Mini UI Mockup Graphic */}
                        <div
                          className="cfg-theme-preview"
                          style={{
                            background:
                              theme.id === "custom" && draft.interfaceGradient.enabled
                                ? `linear-gradient(135deg, ${draft.interfaceGradient.stops[0]?.color || "#160b38"}, ${draft.interfaceGradient.stops[1]?.color || "#05020d"})`
                                : theme.bg,
                          }}
                        >
                          {theme.id === "custom" ? (
                            <div className="cfg-mini-custom-overlay">
                              <div className="cfg-custom-icon-wrapper">
                                <Palette size={20} className="cfg-custom-mini-icon" />
                                <Sparkles size={11} className="cfg-custom-mini-sparkle" />
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="cfg-mini-sidebar">
                                <div className="cfg-mini-logo" style={{ color: theme.accent }} />
                                <div className="cfg-mini-icon" />
                                <div className="cfg-mini-icon" />
                                <div className="cfg-mini-icon" />
                              </div>
                              <div className="cfg-mini-main">
                                <div className="cfg-mini-topbar" style={{ background: theme.accent }} />
                                <div className="cfg-mini-card">
                                  <div className="cfg-mini-line long" />
                                  <div className="cfg-mini-line short" />
                                </div>
                                <div className="cfg-mini-card">
                                  <div className="cfg-mini-line long" />
                                  <div className="cfg-mini-line short" />
                                </div>
                              </div>
                              <div className="cfg-mini-bottom-glow" style={{ background: theme.accent }} />
                            </>
                          )}
                        </div>

                        <div className="cfg-theme-info">
                          <span className="cfg-theme-name">{theme.name}</span>
                          {isSelected && <span className="cfg-theme-status">{t.settings.personalization.customCurrent}</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Card 2: Cor de destaque (Intacto) */}
            <div className="cfg-card">
              <div className="cfg-card-header">
                <div className="cfg-card-icon-box">
                  <Palette className="cfg-card-icon" size={20} />
                </div>
                <div>
                  <h3 className="cfg-card-title">{t.settings.personalization.accentColorTitle}</h3>
                  <p className="cfg-card-subtitle">{t.settings.personalization.accentColorSubtitle}</p>
                </div>
              </div>
              <div className="cfg-card-content">
                <div className="accent-swatches">
                  {[
                    { id: "cyan", name: "Ciano Elétrico", bg: "#06b6d4" },
                    { id: "emerald", name: "Verde Esmeralda", bg: "#10b981" },
                    { id: "amber", name: "Âmbar Dourado", bg: "#f59e0b" },
                    { id: "red", name: "Carmim Obscuro", bg: "#ef4444" },
                    { id: "blue", name: "Azul Cobalto", bg: "#3b82f6" },
                    { id: "violet", name: "Violeta Ametista", bg: "#8b5cf6" },
                    { id: "pink", name: "Pink Neon", bg: "#ec4899" },
                    { id: "coral", name: "Coral Laranja", bg: "#f97316" },
                    { id: "gradient_sunset", name: "Gradiente Fogo Sunset", bg: "linear-gradient(135deg, #ff4500, #ff8c00)" },
                    { id: "gradient_cyberpunk", name: "Gradiente Cyberpunk Pink/Roxo", bg: "linear-gradient(135deg, #ec4899, #8b5cf6)" },
                    { id: "gradient_ocean", name: "Gradiente Oceano Ciano/Azul", bg: "linear-gradient(135deg, #06b6d4, #3b82f6)" },
                    { id: "gradient_aurora", name: "Gradiente Aurora Esmeralda/Ciano", bg: "linear-gradient(135deg, #10b981, #06b6d4)" },
                    { id: "gradient_flow", name: "✨ Cosmic Flow (Gradiente Animado)", bg: "linear-gradient(135deg, #00f2fe, #7928ca, #ff007a)" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`accent-swatch ${draft.accentColor === item.id ? "active" : ""}`}
                      style={{ background: item.bg }}
                      onClick={() => update("accentColor", item.id as AccentColor)}
                      aria-label={item.name}
                      title={item.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: Animações e Efeitos da Interface */}
            <div className="cfg-card">
              <div className="cfg-card-header" style={{ justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div className="cfg-card-icon-box">
                    <Sparkles className="cfg-card-icon" size={18} />
                  </div>
                  <div>
                    <h3 className="cfg-card-title">{t.settings.personalization.interfaceAnimTitle}</h3>
                    <p className="cfg-card-subtitle">{t.settings.personalization.interfaceAnimSubtitle}</p>
                  </div>
                </div>
                <div className="cfg-item-right">
                  <Toggle
                    checked={draft.sidebarAnimation ?? true}
                    onChange={(value) => update("sidebarAnimation", value)}
                  />
                </div>
              </div>
            </div>

            {/* Modal Drawer: Personalizar Tema (Do print do usuario) */}
            {customizerModalOpen && (
              <ThemeCustomizerModal
                config={draft.interfaceGradient}
                onChangeGradient={(val) => {
                  const next = { ...draft, interfaceGradient: val };
                  setDraft(next);
                  onSave(next);
                }}
                onClose={() => setCustomizerModalOpen(false)}
              />
            )}
          </div>
        )}

        {/* ABA: ARQUIVOS */}
        {activeTab === "arquivos" && (
          <div className="cfg-tab-view">
            <div className="cfg-grid-2col">
              {/* Coluna Esquerda: Categorias Personalizadas & Sobre as categorias */}
              <div className="cfg-col">
                {/* Card 1: Categorias Personalizadas */}
                <div className="cfg-card">
                  <div className="cfg-card-header">
                    <div className="cfg-card-icon-box">
                      <Folder className="cfg-card-icon" size={18} />
                    </div>
                    <div>
                      <h3 className="cfg-card-title">{t.settings.filesTab.customCategoriesTitle}</h3>
                      <p className="cfg-card-subtitle">{t.settings.filesTab.customCategoriesSubtitle}</p>
                    </div>
                  </div>

                  <div className="cfg-card-content">
                    {/* Formulário de Criação de Categoria */}
                    <div className="cfg-cat-form-row">
                      <input
                        type="text"
                        className="cfg-cat-input"
                        placeholder={t.settings.filesTab.categoryNamePlaceholder}
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        maxLength={60}
                      />
                      <input
                        type="text"
                        className="cfg-cat-input"
                        placeholder={t.settings.filesTab.categoryExtPlaceholder}
                        value={categoryExtensions}
                        onChange={(e) => setCategoryExtensions(e.target.value)}
                      />
                      <button
                        type="button"
                        className="cfg-btn-add-cat"
                        onClick={addCategory}
                        disabled={!categoryName.trim()}
                      >
                        <Plus size={14} />
                        <span>{t.settings.filesTab.addCategory}</span>
                      </button>
                    </div>

                    {/* Tabela de Categorias */}
                    <div className="cfg-cat-table-wrap">
                      <table className="cfg-cat-table">
                        <thead>
                          <tr>
                            <th>{t.settings.filesTab.tableColCategory}</th>
                            <th>{t.settings.filesTab.tableColExtensions}</th>
                            <th className="text-right">{t.settings.filesTab.tableColActions}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {draft.customCategories.length === 0 ? (
                            <tr>
                              <td colSpan={3} style={{ textAlign: "center", color: "var(--muted)", padding: "20px" }}>
                                {t.settings.filesTab.noCategories}
                              </td>
                            </tr>
                          ) : (
                            draft.customCategories.map((cat) => (
                              <tr key={cat.id}>
                                <td>
                                  {editingCatId === cat.id ? (
                                    <input
                                      type="text"
                                      className="cfg-cat-input"
                                      value={editName}
                                      onChange={(e) => setEditName(e.target.value)}
                                      style={{ padding: "2px 6px", fontSize: "12px", width: "90%" }}
                                    />
                                  ) : (
                                    <div className="cfg-cat-name-cell">
                                      <Folder size={15} className="cfg-cat-folder-icon" />
                                      <span>{cat.name}</span>
                                    </div>
                                  )}
                                </td>
                                <td className="cfg-cat-ext-cell">
                                  {editingCatId === cat.id ? (
                                    <input
                                      type="text"
                                      className="cfg-cat-input"
                                      value={editExts}
                                      onChange={(e) => setEditExts(e.target.value)}
                                      placeholder="iso, rom, pkg"
                                      style={{ padding: "2px 6px", fontSize: "12px", width: "90%" }}
                                    />
                                  ) : (
                                    Array.isArray(cat.extensions) ? cat.extensions.join(", ") : ""
                                  )}
                                </td>
                                <td className="text-right">
                                  <div className="cfg-cat-actions">
                                    {editingCatId === cat.id ? (
                                      <button
                                        type="button"
                                        className="cfg-cat-action-btn edit"
                                        onClick={() => saveEditCategory(cat.id)}
                                        title={t.settings.filesTab.saveChangesTooltip}
                                        style={{ color: "var(--ember, #22d3ee)" }}
                                      >
                                        <Check size={13} />
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        className="cfg-cat-action-btn edit"
                                        onClick={() => startEditCategory(cat)}
                                        title={t.settings.filesTab.editCategoryTooltip}
                                      >
                                        <Pencil size={13} />
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      className="cfg-cat-action-btn delete"
                                      onClick={() => removeCategory(cat.id)}
                                      title={t.settings.filesTab.deleteCategoryTooltip}
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Card 2: Sobre as categorias */}
                <div className="cfg-card cfg-info-card">
                  <div className="cfg-info-row">
                    <div className="cfg-info-icon-box">
                      <Info size={16} />
                    </div>
                    <div className="cfg-info-text-group">
                      <strong className="cfg-info-title">{t.settings.filesTab.aboutCategoriesTitle}</strong>
                      <p className="cfg-info-desc">
                        {t.settings.filesTab.aboutCategoriesDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coluna Direita: Organização de Arquivos */}
              <div className="cfg-col">
                <div className="cfg-card">
                  <div className="cfg-card-header">
                    <div className="cfg-card-icon-box">
                      <Folder className="cfg-card-icon" size={18} />
                    </div>
                    <div>
                      <h3 className="cfg-card-title">{t.settings.filesTab.fileOrgTitle}</h3>
                      <p className="cfg-card-subtitle">{t.settings.filesTab.fileOrgSubtitle}</p>
                    </div>
                  </div>

                  <div className="cfg-card-content cfg-list-items">
                    <div className="cfg-item-row">
                      <div className="cfg-item-left">
                        <div>
                          <strong className="cfg-item-label">{t.settings.filesTab.createSubfoldersLabel}</strong>
                          <span className="cfg-item-desc">{t.settings.filesTab.createSubfoldersDesc}</span>
                        </div>
                      </div>
                      <div className="cfg-item-right">
                        <Toggle
                          checked={draft.autoOrganizeEnabled}
                          onChange={(val) => update("autoOrganizeEnabled", val)}
                        />
                      </div>
                    </div>

                    <div className="cfg-item-row">
                      <div className="cfg-item-left">
                        <div>
                          <strong className="cfg-item-label">{t.settings.filesTab.autoRenameLabel}</strong>
                          <span className="cfg-item-desc">{t.settings.filesTab.autoRenameDesc}</span>
                        </div>
                      </div>
                      <div className="cfg-item-right">
                        <Toggle
                          checked={draft.autoRenameDuplicates ?? false}
                          onChange={(val) => update("autoRenameDuplicates", val)}
                        />
                      </div>
                    </div>

                    <div className="cfg-item-row">
                      <div className="cfg-item-left">
                        <div>
                          <strong className="cfg-item-label">{t.settings.filesTab.preventDuplicatesLabel}</strong>
                          <span className="cfg-item-desc">{t.settings.filesTab.preventDuplicatesDesc}</span>
                        </div>
                      </div>
                      <div className="cfg-item-right">
                        <Toggle
                          checked={draft.autoRenameDuplicates ?? true}
                          onChange={(val) => update("autoRenameDuplicates", val)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA: IDIOMA */}
        {activeTab === "idioma" && (
          <div className="cfg-tab-view">
            <div className="cfg-card">
              <div className="cfg-card-header" style={{ justifyContent: "space-between", width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div className="cfg-card-icon-box">
                    <Globe className="cfg-card-icon" size={20} />
                  </div>
                  <div>
                    <h3 className="cfg-card-title">{t.settings.languageTab.title}</h3>
                    <p className="cfg-card-subtitle">{t.settings.languageTab.subtitle}</p>
                  </div>
                </div>
                <div className="cfg-item-right">
                  <CustomSelect
                    value={draft.language}
                    options={[
                      { value: "pt-BR", label: t.settings.languageTab.ptBR },
                      { value: "en-US", label: t.settings.languageTab.enUS },
                    ]}
                    onChange={(val) => {
                      const newLang = val as AppLanguage;
                      setLanguage(newLang);
                      update("language", newLang);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA: AVANÇADO */}
        {activeTab === "avancado" && (
          <div className="cfg-tab-view">
            <div className="cfg-card">
              <div className="cfg-card-header">
                <div className="cfg-card-icon-box">
                  <Settings2 className="cfg-card-icon" size={20} />
                </div>
                <div>
                  <h3 className="cfg-card-title">{t.settings.advancedTab.startupTrayTitle}</h3>
                  <p className="cfg-card-subtitle">{t.settings.advancedTab.startupTraySubtitle}</p>
                </div>
              </div>
              <div className="cfg-card-content cfg-list-items">
                <div className="cfg-item-row">
                  <div className="cfg-item-left">
                    <Settings2 size={18} className="cfg-item-icon" />
                    <div>
                      <strong className="cfg-item-label">{t.settings.advancedTab.launchOnStartupLabel}</strong>
                      <span className="cfg-item-desc">{t.settings.advancedTab.launchOnStartupDesc}</span>
                    </div>
                  </div>
                  <div className="cfg-item-right">
                    <Toggle
                      checked={draft.launchOnStartup}
                      onChange={(value) => {
                        update("launchOnStartup", value);
                        void setLaunchOnStartup(value).catch(console.error);
                      }}
                    />
                  </div>
                </div>

                <div className="cfg-item-row">
                  <div className="cfg-item-left">
                    <Bot size={18} className="cfg-item-icon" />
                    <div>
                      <strong className="cfg-item-label">{t.settings.advancedTab.floatingAiLabel}</strong>
                      <span className="cfg-item-desc">{t.settings.advancedTab.floatingAiDesc}</span>
                    </div>
                  </div>
                  <div className="cfg-item-right">
                    <Toggle
                      checked={draft.showAiAssistant ?? true}
                      onChange={(value) => update("showAiAssistant", value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="cfg-card">
              <div className="cfg-card-header" style={{ justifyContent: "space-between", width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div className="cfg-card-icon-box">
                    <Globe className="cfg-card-icon" size={20} />
                  </div>
                  <div>
                    <h3 className="cfg-card-title">{t.settings.advancedTab.browserIntegrationCardTitle}</h3>
                    <p className="cfg-card-subtitle">{t.settings.advancedTab.browserIntegrationCardSubtitle}</p>
                  </div>
                </div>
                <span className="cfg-autosave" style={{ fontSize: "11px", height: "fit-content" }}>
                  {t.settings.advancedTab.extensionBadge}
                </span>
              </div>
              <div className="cfg-card-content">
                <p style={{ fontSize: "12.5px", color: "var(--text-2)", marginBottom: "12px" }}>
                  {t.settings.advancedTab.extensionCardDesc}
                </p>
                <button
                  type="button"
                  className="cfg-btn-alterar"
                  onClick={openBrowserIntegration}
                >
                  <Globe size={15} />
                  <span>{t.settings.advancedTab.configureIntegrationBtn}</span>
                </button>
              </div>
            </div>

            <div className="cfg-card">
              <div className="cfg-card-header" style={{ justifyContent: "space-between", width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div className="cfg-card-icon-box">
                    <Bug className="cfg-card-icon" size={20} />
                  </div>
                  <div>
                    <h3 className="cfg-card-title">{t.settings.advancedTab.debugMenuTitle}</h3>
                    <p className="cfg-card-subtitle">{t.settings.advancedTab.debugMenuSubtitle}</p>
                  </div>
                </div>
              </div>
              <div className="cfg-card-content">
                <p style={{ fontSize: "12.5px", color: "var(--text-2)", marginBottom: "12px" }}>
                  {t.settings.advancedTab.debugMenuDesc}
                </p>
                <button
                  type="button"
                  className="cfg-btn-alterar"
                  onClick={openDebugWindow}
                >
                  <Bug size={15} />
                  <span>{t.settings.advancedTab.openDebugMenuBtn}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
