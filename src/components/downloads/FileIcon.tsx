import React, { useId } from "react";

export type FileTypeInfo = {
  label: string;
  color1: string;
  color2: string;
  fold1: string;
  fold2: string;
  textColor?: string;
  isMedia?: boolean;
  isArchive?: boolean;
};

export const FILE_TYPES: Record<string, FileTypeInfo> = {
  // --- Compactados (SVG Zipper Archive com zíper e badge em tamanho idêntico aos outros ícones) ---
  zip:  { label: "ZIP",  color1: "#ffb400", color2: "#ff7a00", fold1: "#ffd76a", fold2: "#ff9a1f", textColor: "#ffffff", isArchive: true },
  rar:  { label: "RAR",  color1: "#ffb400", color2: "#ff7a00", fold1: "#ffd76a", fold2: "#ff9a1f", textColor: "#ffffff", isArchive: true },
  "7z": { label: "7Z",   color1: "#ffb400", color2: "#ff7a00", fold1: "#ffd76a", fold2: "#ff9a1f", textColor: "#ffffff", isArchive: true },
  tar:  { label: "TAR",  color1: "#ffb400", color2: "#ff7a00", fold1: "#ffd76a", fold2: "#ff9a1f", textColor: "#ffffff", isArchive: true },
  gz:   { label: "GZ",   color1: "#ffb400", color2: "#ff7a00", fold1: "#ffd76a", fold2: "#ff9a1f", textColor: "#ffffff", isArchive: true },
  tgz:  { label: "TGZ",  color1: "#ffb400", color2: "#ff7a00", fold1: "#ffd76a", fold2: "#ff9a1f", textColor: "#ffffff", isArchive: true },
  bz2:  { label: "BZ2",  color1: "#ffb400", color2: "#ff7a00", fold1: "#ffd76a", fold2: "#ff9a1f", textColor: "#ffffff", isArchive: true },
  xz:   { label: "XZ",   color1: "#ffb400", color2: "#ff7a00", fold1: "#ffd76a", fold2: "#ff9a1f", textColor: "#ffffff", isArchive: true },
  zipx: { label: "ZIPX", color1: "#ffb400", color2: "#ff7a00", fold1: "#ffd76a", fold2: "#ff9a1f", textColor: "#ffffff", isArchive: true },

  // --- Mídia (Vídeos e Áudios -> SVG Media Player) ---
  mp4:  { label: "MP4",  color1: "#ff4fa8", color2: "#ff0f8a", fold1: "#f8dced", fold2: "#e9bfd8", textColor: "#ffffff", isMedia: true },
  mkv:  { label: "MKV",  color1: "#ff4fa8", color2: "#ff0f8a", fold1: "#f8dced", fold2: "#e9bfd8", textColor: "#ffffff", isMedia: true },
  avi:  { label: "AVI",  color1: "#ff4fa8", color2: "#ff0f8a", fold1: "#f8dced", fold2: "#e9bfd8", textColor: "#ffffff", isMedia: true },
  mov:  { label: "MOV",  color1: "#ff4fa8", color2: "#ff0f8a", fold1: "#f8dced", fold2: "#e9bfd8", textColor: "#ffffff", isMedia: true },
  webm: { label: "WEBM", color1: "#ff4fa8", color2: "#ff0f8a", fold1: "#f8dced", fold2: "#e9bfd8", textColor: "#ffffff", isMedia: true },
  flv:  { label: "FLV",  color1: "#ff4fa8", color2: "#ff0f8a", fold1: "#f8dced", fold2: "#e9bfd8", textColor: "#ffffff", isMedia: true },
  wmv:  { label: "WMV",  color1: "#ff4fa8", color2: "#ff0f8a", fold1: "#f8dced", fold2: "#e9bfd8", textColor: "#ffffff", isMedia: true },
  m4v:  { label: "M4V",  color1: "#ff4fa8", color2: "#ff0f8a", fold1: "#f8dced", fold2: "#e9bfd8", textColor: "#ffffff", isMedia: true },
  "3gp":{ label: "3GP",  color1: "#ff4fa8", color2: "#ff0f8a", fold1: "#f8dced", fold2: "#e9bfd8", textColor: "#ffffff", isMedia: true },

  mp3:  { label: "MP3",  color1: "#C084FC", color2: "#7E22CE", fold1: "#F3E8FF", fold2: "#E9D5FF", textColor: "#ffffff", isMedia: true },
  wav:  { label: "WAV",  color1: "#C084FC", color2: "#7E22CE", fold1: "#F3E8FF", fold2: "#E9D5FF", textColor: "#ffffff", isMedia: true },
  flac: { label: "FLAC", color1: "#C084FC", color2: "#7E22CE", fold1: "#F3E8FF", fold2: "#E9D5FF", textColor: "#ffffff", isMedia: true },
  ogg:  { label: "OGG",  color1: "#C084FC", color2: "#7E22CE", fold1: "#F3E8FF", fold2: "#E9D5FF", textColor: "#ffffff", isMedia: true },
  aac:  { label: "AAC",  color1: "#C084FC", color2: "#7E22CE", fold1: "#F3E8FF", fold2: "#E9D5FF", textColor: "#ffffff", isMedia: true },
  m4a:  { label: "M4A",  color1: "#C084FC", color2: "#7E22CE", fold1: "#F3E8FF", fold2: "#E9D5FF", textColor: "#ffffff", isMedia: true },
  wma:  { label: "WMA",  color1: "#C084FC", color2: "#7E22CE", fold1: "#F3E8FF", fold2: "#E9D5FF", textColor: "#ffffff", isMedia: true },
  opus: { label: "OPUS", color1: "#C084FC", color2: "#7E22CE", fold1: "#F3E8FF", fold2: "#E9D5FF", textColor: "#ffffff", isMedia: true },

  // --- Documentos Genéricos & Outros (SVG Padrão Gradiente) ---
  pdf:  { label: "PDF",  color1: "#FF5252", color2: "#D32F2F", fold1: "#FFCDD2", fold2: "#EF9A9A", textColor: "#ffffff" },
  
  png:  { label: "PNG",  color1: "#34D399", color2: "#059669", fold1: "#D1FAE5", fold2: "#A7F3D0", textColor: "#1a1f2b" },
  jpg:  { label: "JPG",  color1: "#34D399", color2: "#059669", fold1: "#D1FAE5", fold2: "#A7F3D0", textColor: "#1a1f2b" },
  jpeg: { label: "JPG",  color1: "#34D399", color2: "#059669", fold1: "#D1FAE5", fold2: "#A7F3D0", textColor: "#1a1f2b" },
  gif:  { label: "GIF",  color1: "#34D399", color2: "#059669", fold1: "#D1FAE5", fold2: "#A7F3D0", textColor: "#1a1f2b" },
  webp: { label: "WEBP", color1: "#34D399", color2: "#059669", fold1: "#D1FAE5", fold2: "#A7F3D0", textColor: "#1a1f2b" },
  
  exe:  { label: "EXE",  color1: "#A3E635", color2: "#65A30D", fold1: "#ECFCCB", fold2: "#D9F99D", textColor: "#1a1f2b" },
  msi:  { label: "MSI",  color1: "#A3E635", color2: "#65A30D", fold1: "#ECFCCB", fold2: "#D9F99D", textColor: "#1a1f2b" },
  apk:  { label: "APK",  color1: "#A3E635", color2: "#65A30D", fold1: "#ECFCCB", fold2: "#D9F99D", textColor: "#1a1f2b" },
  
  txt:  { label: "TXT",  color1: "#38BDF8", color2: "#0284C7", fold1: "#E0F2FE", fold2: "#BAE6FD", textColor: "#1a1f2b" },
  doc:  { label: "DOC",  color1: "#38BDF8", color2: "#0284C7", fold1: "#E0F2FE", fold2: "#BAE6FD", textColor: "#1a1f2b" },
  docx: { label: "DOCX", color1: "#38BDF8", color2: "#0284C7", fold1: "#E0F2FE", fold2: "#BAE6FD", textColor: "#1a1f2b" },
  xls:  { label: "XLS",  color1: "#34D399", color2: "#059669", fold1: "#D1FAE5", fold2: "#A7F3D0", textColor: "#1a1f2b" },
  xlsx: { label: "XLSX", color1: "#34D399", color2: "#059669", fold1: "#D1FAE5", fold2: "#A7F3D0", textColor: "#1a1f2b" },
  
  iso:  { label: "ISO",  color1: "#94A3B8", color2: "#475569", fold1: "#F1F5F9", fold2: "#E2E8F0", textColor: "#ffffff" },
  bin:  { label: "BIN",  color1: "#94A3B8", color2: "#475569", fold1: "#F1F5F9", fold2: "#E2E8F0", textColor: "#ffffff" },
  img:  { label: "IMG",  color1: "#94A3B8", color2: "#475569", fold1: "#F1F5F9", fold2: "#E2E8F0", textColor: "#ffffff" },
  
  torrent: { label: "TORRENT", color1: "#00E6A5", color2: "#00B884", fold1: "#D1FAE5", fold2: "#A7F3D0", textColor: "#1a1f2b" },
};

export const DEFAULT_FILE_TYPE: FileTypeInfo = {
  label: "FILE",
  color1: "#A1A1AA",
  color2: "#52525B",
  fold1: "#F4F4F5",
  fold2: "#E4E4E7",
  textColor: "#ffffff",
  isMedia: false,
  isArchive: false,
};

export function getFileTypeInfo(filenameOrExt: string | null | undefined): FileTypeInfo {
  if (!filenameOrExt) {
    return DEFAULT_FILE_TYPE;
  }

  let ext = String(filenameOrExt).trim().toLowerCase();
  if (ext.includes(".")) {
    const parts = ext.split(".");
    ext = parts.pop() || "";
  }

  if (ext && FILE_TYPES[ext]) {
    return FILE_TYPES[ext];
  }

  if (ext && ext.length <= 6 && /^[a-z0-9]+$/i.test(ext)) {
    return {
      label: ext.toUpperCase(),
      color1: "#A1A1AA",
      color2: "#52525B",
      fold1: "#F4F4F5",
      fold2: "#E4E4E7",
      textColor: "#ffffff",
      isMedia: false,
      isArchive: false,
    };
  }

  return DEFAULT_FILE_TYPE;
}

export function getLabelFontSize(label: string | null | undefined, mode: "archive" | "media" | "document" = "document"): number {
  const textStr = label ? String(label) : "FILE";
  const len = textStr.length;
  if (mode === "archive" || mode === "media") {
    if (len <= 4) return 215; // Mesmo tamanho visual dos outros ícones!
    if (len === 5) return 175;
    return 140;
  }
  if (len <= 4) return 235;
  if (len === 5) return 180;
  return 145;
}

export interface FileIconProps {
  label?: string;
  color1?: string;
  color2?: string;
  fold1?: string;
  fold2?: string;
  textColor?: string;
  isMedia?: boolean;
  isArchive?: boolean;
  extension?: string | null;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export function FileIcon({
  label,
  color1,
  color2,
  fold1,
  fold2,
  textColor,
  isMedia,
  isArchive,
  extension,
  width,
  height,
  className,
  style,
}: FileIconProps) {
  const reactId = useId().replace(/:/g, "_");

  let displayLabel = label;
  let displayColor1 = color1;
  let displayColor2 = color2;
  let displayFold1 = fold1;
  let displayFold2 = fold2;
  let displayTextColor = textColor;
  let displayIsMedia = isMedia;
  let displayIsArchive = isArchive;

  if (!displayLabel || !displayColor1) {
    const info = getFileTypeInfo(extension || label);
    if (!displayLabel) displayLabel = info.label;
    if (!displayColor1) displayColor1 = info.color1;
    if (!displayColor2) displayColor2 = info.color2;
    if (!displayFold1) displayFold1 = info.fold1;
    if (!displayFold2) displayFold2 = info.fold2;
    if (!displayTextColor) displayTextColor = info.textColor;
    if (displayIsMedia === undefined) displayIsMedia = info.isMedia;
    if (displayIsArchive === undefined) displayIsArchive = info.isArchive;
  }

  const finalLabel = displayLabel ? String(displayLabel) : "FILE";
  const finalColor1 = displayColor1 ? String(displayColor1) : "#ffb400";
  const finalColor2 = displayColor2 ? String(displayColor2) : "#ff7a00";
  const finalFold1 = displayFold1 ? String(displayFold1) : "#ffd76a";
  const finalFold2 = displayFold2 ? String(displayFold2) : "#ff9a1f";
  const finalTextColor = displayTextColor ? String(displayTextColor) : "#ffffff";

  const mode = displayIsArchive ? "archive" : displayIsMedia ? "media" : "document";
  const fontSize = getLabelFontSize(finalLabel, mode);

  const archiveBodyGradId = `archiveBodyGrad_${reactId}`;
  const archiveFoldGradId = `archiveFoldGrad_${reactId}`;
  const zipTrackGradId = `zipTrackGrad_${reactId}`;
  const sliderGradId = `sliderGrad_${reactId}`;
  const mediaBodyGradId = `mediaBodyGrad_${reactId}`;
  const mediaFoldGradId = `mediaFoldGrad_${reactId}`;
  const bodyGradId = `fileBodyGrad_${reactId}`;
  const foldGradId = `fileFoldGrad_${reactId}`;
  const topHighlightId = `topHighlight_${reactId}`;
  const bottomShadeId = `bottomShade_${reactId}`;
  const outerGlowId = `outerGlow_${reactId}`;
  const creaseShadowId = `creaseShadow_${reactId}`;

  const customStyle: React.CSSProperties = {
    ["--archive-bg-1" as string]: finalColor1,
    ["--archive-bg-2" as string]: finalColor2,
    ["--archive-fold-1" as string]: finalFold1,
    ["--archive-fold-2" as string]: finalFold2,
    ["--archive-outline" as string]: "#111827",
    ["--archive-zip-dark" as string]: "#263243",
    ["--archive-zip-light" as string]: "#cfd6df",
    ["--archive-slider-light" as string]: "#f4f7fb",
    ["--archive-slider-dark" as string]: "#b7c0cb",
    ["--archive-badge-text" as string]: finalTextColor,
    ["--media-file-bg-1" as string]: finalColor1,
    ["--media-file-bg-2" as string]: finalColor2,
    ["--media-file-fold-1" as string]: finalFold1,
    ["--media-file-fold-2" as string]: finalFold2,
    ["--media-file-outline" as string]: "#1c2230",
    ["--media-file-play-bg" as string]: "rgba(255,255,255,0.18)",
    ["--media-file-play-icon" as string]: "#ffffff",
    ["--media-file-badge-bg" as string]: "#1c2230",
    ["--media-file-badge-text" as string]: finalTextColor,
    ["--file-icon-accent-1" as string]: finalColor1,
    ["--file-icon-accent-2" as string]: finalColor2,
    ["--file-icon-fold-1" as string]: finalFold1,
    ["--file-icon-fold-2" as string]: finalFold2,
    ["--file-icon-text" as string]: finalTextColor,
    ...style,
  };

  // 1. Caso seja Compactado (ZIP, RAR, 7Z, TAR, GZ) -> Renderiza o SVG com Zíper e Badge no Tamanho Idêntico
  if (displayIsArchive) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1024 1024"
        width={width ?? "100%"}
        height={height ?? "100%"}
        className={className}
        style={customStyle}
      >
        <defs>
          {/* gradiente do corpo */}
          <linearGradient id={archiveBodyGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--archive-bg-1, #ffb400)" />
            <stop offset="100%" stopColor="var(--archive-bg-2, #ff7a00)" />
          </linearGradient>

          {/* gradiente da dobra */}
          <linearGradient id={archiveFoldGradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--archive-fold-1, #ffd76a)" />
            <stop offset="100%" stopColor="var(--archive-fold-2, #ff9a1f)" />
          </linearGradient>

          {/* highlight superior */}
          <linearGradient id={topHighlightId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.20)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.03)" />
          </linearGradient>

          {/* sombra inferior */}
          <linearGradient id={bottomShadeId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
          </linearGradient>

          {/* gradiente do trilho do zíper */}
          <linearGradient id={zipTrackGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b4c63" />
            <stop offset="100%" stopColor="#1c2736" />
          </linearGradient>

          {/* gradiente do cursor */}
          <linearGradient id={sliderGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--archive-slider-light, #f4f7fb)" />
            <stop offset="100%" stopColor="var(--archive-slider-dark, #b7c0cb)" />
          </linearGradient>

          {/* glow leve */}
          <filter id={outerGlowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feFlood floodColor="#000000" floodOpacity="0.08" result="glowColor" />
            <feComposite in="glowColor" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter={`url(#${outerGlowId})`}>
          {/* corpo */}
          <path
            d="
              M 170 140
              Q 170 100 210 100
              L 650 100
              L 860 310
              L 860 825
              Q 860 900 785 900
              L 240 900
              Q 170 900 170 830
              Z
            "
            fill={`url(#${archiveBodyGradId})`}
          />

          {/* dobra */}
          <path
            d="
              M 650 100
              L 650 248
              Q 650 310 712 310
              L 860 310
            "
            fill={`url(#${archiveFoldGradId})`}
          />

          {/* highlight topo */}
          <path
            d="
              M 200 140
              Q 200 120 220 120
              L 590 120
              Q 625 120 625 140
              Q 625 156 590 156
              L 220 156
              Q 200 156 200 140
              Z
            "
            fill={`url(#${topHighlightId})`}
          />

          {/* sombra inferior */}
          <path
            d="
              M 205 842
              Q 205 875 245 875
              L 775 875
              Q 825 875 840 835
              L 840 860
              Q 840 900 785 900
              L 240 900
              Q 170 900 170 830
              L 170 805
              Q 182 842 205 842
              Z
            "
            fill={`url(#${bottomShadeId})`}
          />

          {/* trilho do zíper */}
          <rect
            x="482"
            y="118"
            width="60"
            height="462"
            rx="20"
            fill={`url(#${zipTrackGradId})`}
            stroke="var(--archive-outline, #111827)"
            strokeWidth="8"
          />

          {/* dentes do zíper esquerda */}
          <g fill="var(--archive-zip-light, #cfd6df)">
            <rect x="454" y="132" width="32" height="16" rx="5" />
            <rect x="454" y="174" width="32" height="16" rx="5" />
            <rect x="454" y="216" width="32" height="16" rx="5" />
            <rect x="454" y="258" width="32" height="16" rx="5" />
            <rect x="454" y="300" width="32" height="16" rx="5" />
            <rect x="454" y="342" width="32" height="16" rx="5" />
            <rect x="454" y="384" width="32" height="16" rx="5" />
            <rect x="454" y="426" width="32" height="16" rx="5" />
            <rect x="454" y="468" width="32" height="16" rx="5" />
            <rect x="454" y="510" width="32" height="16" rx="5" />
          </g>

          {/* dentes do zíper direita */}
          <g fill="var(--archive-zip-light, #cfd6df)">
            <rect x="538" y="153" width="32" height="16" rx="5" />
            <rect x="538" y="195" width="32" height="16" rx="5" />
            <rect x="538" y="237" width="32" height="16" rx="5" />
            <rect x="538" y="279" width="32" height="16" rx="5" />
            <rect x="538" y="321" width="32" height="16" rx="5" />
            <rect x="538" y="363" width="32" height="16" rx="5" />
            <rect x="538" y="405" width="32" height="16" rx="5" />
            <rect x="538" y="447" width="32" height="16" rx="5" />
            <rect x="538" y="489" width="32" height="16" rx="5" />
            <rect x="538" y="531" width="32" height="16" rx="5" />
          </g>

          {/* cursor do zíper */}
          <g>
            <rect
              x="445"
              y="520"
              width="134"
              height="178"
              rx="46"
              fill={`url(#${sliderGradId})`}
              stroke="var(--archive-outline, #111827)"
              strokeWidth="8"
            />
            <rect
              x="487"
              y="540"
              width="50"
              height="88"
              rx="18"
              fill="rgba(255,255,255,0.88)"
              stroke="var(--archive-outline, #111827)"
              strokeWidth="6"
            />
            <rect
              x="470"
              y="610"
              width="84"
              height="50"
              rx="14"
              fill={`url(#${archiveBodyGradId})`}
              stroke="var(--archive-outline, #111827)"
              strokeWidth="6"
            />
          </g>

          {/* badge inferior ampliada (230px de altura) */}
          <rect
            x="150"
            y="650"
            width="724"
            height="230"
            rx="42"
            fill="rgba(0,0,0,0.30)"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="6"
          />

          {/* contorno do arquivo */}
          <path
            d="
              M 170 140
              Q 170 100 210 100
              L 650 100
              L 860 310
              L 860 825
              Q 860 900 785 900
              L 240 900
              Q 170 900 170 830
              Z
            "
            fill="none"
            stroke="var(--archive-outline, #111827)"
            strokeWidth="18"
            strokeLinejoin="round"
          />

          {/* contorno da dobra */}
          <path
            d="
              M 650 100
              L 650 248
              Q 650 310 712 310
              L 860 310
            "
            fill="none"
            stroke="var(--archive-outline, #111827)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* texto (215px Ultra-Bold Idêntico aos Outros Ícones) */}
          <text
            x="512"
            y="765"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="Inter, Segoe UI, Arial, Helvetica, sans-serif"
            fontSize={fontSize}
            fontWeight="900"
            letterSpacing="-2"
            fill="var(--archive-badge-text, #ffffff)"
          >
            {finalLabel}
          </text>
        </g>
      </svg>
    );
  }

  // 2. Caso seja Mídia (Vídeos e Áudios) -> Renderiza o SVG Media Player com Play e Badge no Tamanho Idêntico
  if (displayIsMedia) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1024 1024"
        width={width ?? "100%"}
        height={height ?? "100%"}
        className={className}
        style={customStyle}
      >
        <defs>
          <linearGradient id={mediaBodyGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--media-file-bg-1, #ff4fa8)" />
            <stop offset="100%" stopColor="var(--media-file-bg-2, #ff0f8a)" />
          </linearGradient>

          <linearGradient id={mediaFoldGradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--media-file-fold-1, #f8dced)" />
            <stop offset="100%" stopColor="var(--media-file-fold-2, #e9bfd8)" />
          </linearGradient>

          <linearGradient id={topHighlightId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.20)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.03)" />
          </linearGradient>

          <filter id={creaseShadowId} x="-20%" y="-20%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* Corpo do arquivo */}
        <path
          d="
            M 172 152
            Q 172 112 212 112
            L 652 112
            L 856 316
            L 856 812
            Q 856 900 768 900
            L 256 900
            Q 172 900 172 816
            Z
          "
          fill={`url(#${mediaBodyGradId})`}
        />

        {/* Highlight superior */}
        <path
          d="
            M 202 152
            Q 202 130 224 130
            L 572 130
            Q 615 130 615 150
            Q 615 166 572 166
            L 224 166
            Q 202 166 202 152
            Z
          "
          fill={`url(#${topHighlightId})`}
        />

        {/* Dobra */}
        <path
          d="
            M 652 112
            L 652 248
            Q 652 316 720 316
            L 856 316
            Z
          "
          fill={`url(#${mediaFoldGradId})`}
        />

        {/* Sombra da dobra */}
        <path
          d="
            M 652 112
            L 652 248
            Q 652 316 720 316
            L 856 316
          "
          fill="none"
          stroke="rgba(120, 0, 70, 0.18)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${creaseShadowId})`}
        />

        {/* Contorno do arquivo */}
        <path
          d="
            M 172 152
            Q 172 112 212 112
            L 652 112
            L 856 316
            L 856 812
            Q 856 900 768 900
            L 256 900
            Q 172 900 172 816
            Z
          "
          fill="none"
          stroke="var(--media-file-outline, #1c2230)"
          strokeWidth="18"
          strokeLinejoin="round"
        />

        {/* Contorno da dobra */}
        <path
          d="
            M 652 112
            L 652 248
            Q 652 316 720 316
            L 856 316
          "
          fill="none"
          stroke="var(--media-file-outline, #1c2230)"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Círculo do play */}
        <circle
          cx="512"
          cy="400"
          r="115"
          fill="var(--media-file-play-bg, rgba(255,255,255,0.18))"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="10"
        />

        {/* Ícone play */}
        <path
          d="
            M 480 340
            L 480 460
            L 580 400
            Z
          "
          fill="var(--media-file-play-icon, #ffffff)"
        />

        {/* Badge inferior ampliada (230px de altura) */}
        <rect
          x="150"
          y="620"
          width="724"
          height="230"
          rx="44"
          fill="var(--media-file-badge-bg, #1c2230)"
        />

        {/* Texto da extensão (215px Idêntico aos Outros Ícones) */}
        <text
          x="512"
          y="735"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Inter, Segoe UI, Arial, Helvetica, sans-serif"
          fontSize={fontSize}
          fontWeight="900"
          letterSpacing="-2"
          fill="var(--media-file-badge-text, #ffffff)"
        >
          {finalLabel}
        </text>
      </svg>
    );
  }

  // 3. Caso Geral (Documentos, Instaladores, Imagens) -> Renderiza o SVG Padrão Gradiente
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      width={width ?? "100%"}
      height={height ?? "100%"}
      className={className}
      style={customStyle}
    >
      <defs>
        {/* Gradiente do corpo */}
        <linearGradient id={bodyGradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--file-icon-accent-1, #ff4fb3)" />
          <stop offset="100%" stopColor="var(--file-icon-accent-2, #ff0090)" />
        </linearGradient>

        {/* Gradiente da dobra */}
        <linearGradient id={foldGradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--file-icon-fold-1, #f6d6ea)" />
          <stop offset="100%" stopColor="var(--file-icon-fold-2, #e8bdd8)" />
        </linearGradient>

        {/* Highlight superior */}
        <linearGradient id={topHighlightId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.03)" />
        </linearGradient>

        {/* Sombra inferior */}
        <linearGradient id={bottomShadeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.10)" />
        </linearGradient>

        {/* Glow externo leve */}
        <filter id={outerGlowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feFlood floodColor="var(--file-icon-accent-2, #ff0090)" floodOpacity="0.12" result="glowColor" />
          <feComposite in="glowColor" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Blur da sombra da dobra */}
        <filter id={creaseShadowId} x="-20%" y="-20%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <g filter={`url(#${outerGlowId})`}>
        {/* Corpo */}
        <path
          d="
            M 170 150
            Q 170 110 210 110
            L 655 110
            L 860 315
            L 860 825
            Q 860 900 785 900
            L 240 900
            Q 170 900 170 830
            Z
          "
          fill={`url(#${bodyGradId})`}
        />

        {/* Highlight superior */}
        <path
          d="
            M 200 150
            Q 200 128 222 128
            L 585 128
            Q 620 128 620 148
            Q 620 166 585 166
            L 222 166
            Q 200 166 200 150
            Z
          "
          fill={`url(#${topHighlightId})`}
        />

        {/* Sombra inferior */}
        <path
          d="
            M 205 840
            Q 205 875 245 875
            L 775 875
            Q 825 875 840 832
            L 840 860
            Q 840 900 785 900
            L 240 900
            Q 170 900 170 830
            L 170 800
            Q 180 840 205 840
            Z
          "
          fill={`url(#${bottomShadeId})`}
        />

        {/* Dobra */}
        <path
          d="
            M 655 110
            L 655 248
            Q 655 315 722 315
            L 860 315
            Z
          "
          fill={`url(#${foldGradId})`}
        />

        {/* Sombra da dobra */}
        <path
          d="
            M 655 110
            L 655 248
            Q 655 315 722 315
            L 860 315
          "
          fill="none"
          stroke="rgba(120, 0, 70, 0.22)"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${creaseShadowId})`}
        />

        {/* Contorno do arquivo */}
        <path
          d="
            M 170 150
            Q 170 110 210 110
            L 655 110
            L 860 315
            L 860 825
            Q 860 900 785 900
            L 240 900
            Q 170 900 170 830
            Z
          "
          fill="none"
          stroke="#1a1f2b"
          strokeWidth="18"
          strokeLinejoin="round"
        />

        {/* Contorno da dobra */}
        <path
          d="
            M 655 110
            L 655 248
            Q 655 315 722 315
            L 860 315
          "
          fill="none"
          stroke="#1a1f2b"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Texto */}
        <text
          x="512"
          y="590"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Inter, Segoe UI, Arial, Helvetica, sans-serif"
          fontSize={fontSize}
          fontWeight="800"
          letterSpacing="-10"
          fill="var(--file-icon-text, #1a1f2b)"
        >
          {finalLabel}
        </text>
      </g>
    </svg>
  );
}

export interface FileIconFromNameProps {
  filename: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export function FileIconFromName({
  filename,
  width,
  height,
  className,
  style,
}: FileIconFromNameProps) {
  const info = getFileTypeInfo(filename);
  return (
    <FileIcon
      label={info.label}
      color1={info.color1}
      color2={info.color2}
      fold1={info.fold1}
      fold2={info.fold2}
      textColor={info.textColor}
      isMedia={info.isMedia}
      isArchive={info.isArchive}
      width={width}
      height={height}
      className={className}
      style={style}
    />
  );
}
