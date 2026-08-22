use serde::{Deserialize, Serialize};
use std::{
    collections::VecDeque,
    sync::{Arc, Mutex, OnceLock},
    time::SystemTime,
};
use tauri::{AppHandle, Emitter, Manager, WebviewUrl, WebviewWindowBuilder};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DebugLogEntry {
    pub id: String,
    pub timestamp: String,
    pub level: String,      // "error", "warn", "info"
    pub category: String,   // "download", "inspector", "torrent", "bridge", "extraction", "database", "system"
    pub message: String,
    pub details: Option<String>,
    pub target_url: Option<String>,
    pub download_id: Option<String>,
}

static LOG_BUFFER: OnceLock<Arc<Mutex<VecDeque<DebugLogEntry>>>> = OnceLock::new();
static CREATING_DEBUG_WINDOW: OnceLock<Mutex<bool>> = OnceLock::new();

fn get_log_buffer() -> &'static Arc<Mutex<VecDeque<DebugLogEntry>>> {
    LOG_BUFFER.get_or_init(|| Arc::new(Mutex::new(VecDeque::with_capacity(500))))
}

fn get_creating_flag() -> &'static Mutex<bool> {
    CREATING_DEBUG_WINDOW.get_or_init(|| Mutex::new(false))
}

fn current_timestamp() -> String {
    let now = SystemTime::now();
    let duration = now
        .duration_since(SystemTime::UNIX_EPOCH)
        .unwrap_or_default();
    let total_secs = duration.as_secs();
    let millis = duration.subsec_millis();
    
    let secs_in_day = total_secs % 86400;
    let hours = secs_in_day / 3600;
    let minutes = (secs_in_day % 3600) / 60;
    let seconds = secs_in_day % 60;

    format!("{:02}:{:02}:{:02}.{:03}", hours, minutes, seconds, millis)
}

pub fn add_log(
    level: &str,
    category: &str,
    message: &str,
    details: Option<String>,
    target_url: Option<String>,
    download_id: Option<String>,
    app: Option<&AppHandle>,
) {
    let timestamp = current_timestamp();
    let entry = DebugLogEntry {
        id: uuid::Uuid::new_v4().to_string(),
        timestamp,
        level: level.to_lowercase(),
        category: category.to_lowercase(),
        message: message.to_string(),
        details,
        target_url,
        download_id,
    };

    println!("[DEBUG_LOG][{}][{}] {} {:?}", entry.level.to_uppercase(), entry.category.to_uppercase(), entry.message, entry.details);

    if let Ok(mut buffer) = get_log_buffer().lock() {
        if buffer.len() >= 500 {
            buffer.pop_front();
        }
        buffer.push_back(entry.clone());
    }

    if let Some(app) = app {
        let _ = app.emit("debug-log-entry", entry);
    }
}

pub fn log_error(
    category: &str,
    message: &str,
    details: Option<String>,
    target_url: Option<String>,
    download_id: Option<String>,
    app: Option<&AppHandle>,
) {
    add_log("error", category, message, details, target_url, download_id, app);
}

#[allow(dead_code)]
pub fn log_warn(
    category: &str,
    message: &str,
    details: Option<String>,
    target_url: Option<String>,
    download_id: Option<String>,
    app: Option<&AppHandle>,
) {
    add_log("warn", category, message, details, target_url, download_id, app);
}

#[allow(dead_code)]
pub fn log_info(
    category: &str,
    message: &str,
    details: Option<String>,
    target_url: Option<String>,
    download_id: Option<String>,
    app: Option<&AppHandle>,
) {
    add_log("info", category, message, details, target_url, download_id, app);
}

#[tauri::command]
pub fn get_debug_logs() -> Vec<DebugLogEntry> {
    get_log_buffer()
        .lock()
        .map(|buffer| buffer.iter().cloned().collect())
        .unwrap_or_default()
}

#[tauri::command]
pub fn clear_debug_logs() -> Result<(), String> {
    if let Ok(mut buffer) = get_log_buffer().lock() {
        buffer.clear();
    }
    Ok(())
}

#[tauri::command]
pub async fn open_debug_window(app: AppHandle) -> Result<(), String> {
    let label = "debug-logs";
    if let Some(window) = app.get_webview_window(label) {
        window.set_focus().map_err(|error| error.to_string())?;
        return Ok(());
    }

    {
        let mut creating = get_creating_flag().lock().map_err(|error| error.to_string())?;
        if *creating {
            return Ok(());
        }
        *creating = true;
    }

    #[cfg(debug_assertions)]
    let url = app
        .config()
        .build
        .dev_url
        .clone()
        .map(WebviewUrl::External)
        .unwrap_or_else(|| WebviewUrl::App("index.html".into()));
    #[cfg(not(debug_assertions))]
    let url = WebviewUrl::App("index.html".into());

    let build_result = WebviewWindowBuilder::new(&app, label, url)
        .title("Menu Debug — SFDownloader")
        .inner_size(840.0, 580.0)
        .min_inner_size(680.0, 440.0)
        .resizable(true)
        .decorations(false)
        .visible(false)
        .transparent(true)
        .center()
        .build();

    {
        if let Ok(mut creating) = get_creating_flag().lock() {
            *creating = false;
        }
    }

    build_result.map_err(|error| format!("Falha ao abrir janela de debug: {error}"))?;
    Ok(())
}
