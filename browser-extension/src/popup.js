const capture = document.querySelector("#capture");
const status = document.querySelector("#status");
const connection = document.querySelector("#connection");
const disabledInput = document.querySelector("#disabled-extensions-input");
const btnResetDefault = document.querySelector("#btn-reset-default");
const versionBadge = document.querySelector("#version-badge");

// Extensões ignoradas por padrão (formatos que o navegador lida melhor nativamente)
const DEFAULT_DISABLED_EXTENSIONS = [
  ".JPG",
  ".JPEG",
  ".PNG",
  ".WEBP",
  ".GIF",
  ".TXT",
];

const version = chrome.runtime.getManifest().version;
if (versionBadge) {
  versionBadge.textContent = `v${version}`;
}

function storageGet(keys) {
  return new Promise(resolve => chrome.storage.local.get(keys, resolve));
}

function storageSet(values) {
  return new Promise(resolve => chrome.storage.local.set(values, resolve));
}

function renderCapture(enabled) {
  capture.setAttribute("aria-checked", String(enabled));
}

// Parse the textarea content into a normalized array of extensions
function parseExclusionInput(text) {
  return text
    .split(/[\s,;]+/)
    .map(v => v.trim().toUpperCase())
    .filter(v => v.length > 0)
    .map(v => (v.startsWith(".") ? v : `.${v}`));
}

// Format the array back to display text (without dots, space-separated)
function formatExclusions(arr) {
  return arr
    .map(v => v.replace(/^\./, "").toUpperCase())
    .join(" ");
}

async function updateDisabledExtensions(disabledArray) {
  const value = [...new Set(disabledArray)].sort();
  await storageSet({ disabledExtensions: value });
  chrome.runtime.sendMessage({
    type: "extension-filters-updated",
    disabledExtensions: value,
  });
}

// Debounce to avoid saving on every keystroke
let saveTimeout = null;
function onInputChange() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    const parsed = parseExclusionInput(disabledInput.value);
    void updateDisabledExtensions(parsed);
  }, 400);
}

if (disabledInput) {
  disabledInput.addEventListener("input", onInputChange);
}

if (btnResetDefault) {
  btnResetDefault.addEventListener("click", (e) => {
    e.stopPropagation();
    const defaults = [...DEFAULT_DISABLED_EXTENSIONS];
    if (disabledInput) {
      disabledInput.value = formatExclusions(defaults);
    }
    void updateDisabledExtensions(defaults);
  });
}

function applyTheme(themeAccent, themeBg) {
  if (themeAccent) {
    document.documentElement.style.setProperty("--ember", themeAccent);
    document.documentElement.style.setProperty("--ember-solid", themeAccent);
    document.documentElement.style.setProperty("--accent-cyan", themeAccent);
    document.documentElement.style.setProperty("--st-connected", themeAccent);
    let soft = themeAccent + "26";
    if (themeAccent.startsWith("rgb")) {
      soft = themeAccent.replace("rgb", "rgba").replace(")", ", 0.15)");
    }
    document.documentElement.style.setProperty("--ember-soft", soft);
  }
  if (themeBg) {
    document.documentElement.style.setProperty("--bg-fill", themeBg);
  }
}

function updateThemeFromStorage() {
  chrome.storage.local.get(["themeAccent", "themeBg"], ({ themeAccent, themeBg }) => {
    applyTheme(themeAccent, themeBg);
  });
}

function checkConnection() {
  updateThemeFromStorage();
  chrome.storage.local.get("captureEnabled", ({ captureEnabled = false }) => {
    if (!captureEnabled) {
      connection.classList.remove("connected");
      connection.title = "Integração desativada pelo usuário";
      status.textContent = "Ative a captura automática para conectar";
      status.classList.remove("connected");
      return;
    }
    chrome.runtime.sendMessage({ type: "bridge-status" }, response => {
      const connected = !chrome.runtime.lastError && response?.connected;
      connection.classList.toggle("connected", Boolean(connected));
      connection.title = connected ? "SF Downloader conectado e ativo" : "SF Downloader desconectado";
      status.textContent = connected ? "SF Downloader conectado e ativo" : "Abra o SF Downloader para conectar";
      status.classList.toggle("connected", Boolean(connected));
      if (response?.themeAccent || response?.themeBg) {
        applyTheme(response.themeAccent, response.themeBg);
      }
    });
  });
}

storageGet({ captureEnabled: false, disabledExtensions: null, themeAccent: null, themeBg: null }).then(
  ({ captureEnabled = false, disabledExtensions, themeAccent, themeBg }) => {
    applyTheme(themeAccent, themeBg);
    const disabled = Array.isArray(disabledExtensions)
      ? disabledExtensions
      : [...DEFAULT_DISABLED_EXTENSIONS];
    if (!Array.isArray(disabledExtensions)) {
      storageSet({ disabledExtensions: disabled });
    }
    renderCapture(captureEnabled);
    if (disabledInput) {
      disabledInput.value = formatExclusions(disabled);
    }
  },
);

capture.addEventListener("click", () => {
  const next = capture.getAttribute("aria-checked") !== "true";
  renderCapture(next);
  chrome.storage.local.set({ captureEnabled: next }, () => {
    checkConnection();
    chrome.runtime.sendMessage({ type: "capture-toggled", enabled: next });
  });
});

checkConnection();
setInterval(checkConnection, 2000);
