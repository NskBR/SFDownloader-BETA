import {
  Archive,
  Cpu,
  File,
  FileAudio,
  FileCode2,
  FileImage,
  FileText,
  FileVideo,
} from "lucide-react";
import type { CustomCategory } from "./settings";

const TEMP_EXTENSIONS = new Set([
  "crdownload",
  "part",
  "tmp",
  "temp",
  "download",
  "sfdownload",
  "aria2",
  "unfinished",
  "partial",
]);

export function cleanExtension(fileNameOrUrl: string): string {
  if (!fileNameOrUrl) return "";
  const clean = fileNameOrUrl.split("?")[0].split("#")[0].trim();
  const base = clean.split(/[\\/]/).pop() || clean;
  let parts = base.split(".").filter(Boolean);

  // Remover sufixos temporários de download (.crdownload, .part, .tmp, .sfdownload, .1, etc)
  while (parts.length > 1) {
    const last = parts[parts.length - 1].toLowerCase().trim();
    if (TEMP_EXTENSIONS.has(last) || /^\d+$/.test(last)) {
      parts.pop();
    } else {
      break;
    }
  }

  if (parts.length <= 1) return "";
  return parts.pop()?.toLowerCase().trim() || "";
}

export const downloadCategories = [
  {
    name: "Jogos",
    extensions: ["iso", "rom", "pkg", "nsp", "xci"],
    icon: FileCode2,
    color: "#a855f7",
  },
  {
    name: "Imagens",
    extensions: ["jpg", "jpeg", "png", "webp", "gif", "bmp", "ico", "svg", "tiff", "heic"],
    icon: FileImage,
    color: "#60a5fa",
  },
  {
    name: "Vídeos",
    extensions: ["mp4", "mkv", "mov", "avi", "webm", "flv", "wmv", "m4v", "3gp", "ts"],
    icon: FileVideo,
    color: "#818cf8",
  },
  {
    name: "Áudios",
    extensions: ["mp3", "wav", "flac", "ogg", "m4a", "aac", "wma", "opus", "alac"],
    icon: FileAudio,
    color: "#c084fc",
  },
  {
    name: "Documentos",
    extensions: ["pdf", "docx", "xlsx", "pptx", "txt", "doc", "xls", "ppt", "csv", "rtf", "odt", "epub"],
    icon: FileText,
    color: "#38bdf8",
  },
  {
    name: "Compactados",
    extensions: ["zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz", "cab", "img", "dmg", "z01", "z02", "r00", "r01", "001"],
    icon: Archive,
    color: "#fbbf24",
  },
  {
    name: "Modelos de IA",
    extensions: [
      "safetensors",
      "ckpt",
      "gguf",
      "pt",
      "pth",
      "onnx",
      "tflite",
      "h5",
      "pb",
      "keras",
      "model",
      "mlmodel",
      "safetensor",
      "sft",
      "ggml",
      "ot",
      "tensor",
      "weights",
      "lora",
    ],
    icon: Cpu,
    color: "#ec4899",
  },
  {
    name: "Aplicativos",
    extensions: [
      "exe",
      "msi",
      "apk",
      "bat",
      "cmd",
      "ps1",
      "appimage",
      "deb",
      "rpm",
      "run",
      "bin",
      "jar",
      "vbs",
      "wsf",
      "com",
      "gadget",
      "sh",
      "command",
      "app",
    ],
    icon: FileCode2,
    color: "#34d399",
  },
  { name: "Torrents", extensions: ["torrent"], icon: File, color: "#2dd4bf" },
  { name: "Outros", extensions: [], icon: File, color: "#94a3b8" },
] as const;

const SCRIPT_EXTS = new Set(["php", "aspx", "asp", "cgi", "jsp", "do", "action", "html", "htm"]);

export function categoryForFile(
  fileName: string,
  customCategories: CustomCategory[] = [],
  finalPath?: string,
  originalUrl?: string
): string {
  let ext = cleanExtension(fileName);

  // Se a extensão estiver vazia ou for um script de servidor (ex: php), tentar extrair do finalPath ou originalUrl
  if ((!ext || SCRIPT_EXTS.has(ext)) && finalPath) {
    const pathExt = cleanExtension(finalPath);
    if (pathExt && !SCRIPT_EXTS.has(pathExt)) ext = pathExt;
  }
  if ((!ext || SCRIPT_EXTS.has(ext)) && originalUrl) {
    const urlExt = cleanExtension(originalUrl);
    if (urlExt && !SCRIPT_EXTS.has(urlExt)) ext = urlExt;
  }

  if (!ext) return "Outros";

  const standard = downloadCategories.find(
    (category) =>
      category.name !== "Outros" &&
      category.extensions.some((item) => item.toLowerCase() === ext),
  );
  if (standard) return standard.name;

  return (
    customCategories.find((category) =>
      category.extensions.some((item) => item.toLowerCase() === ext),
    )?.name ?? "Outros"
  );
}
