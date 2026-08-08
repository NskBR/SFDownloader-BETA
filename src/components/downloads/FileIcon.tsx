import {
  Archive,
  Boxes,
  File,
  FileArchive,
  FileAudio,
  FileCode2,
  FileImage,
  FileText,
  FileVideo,
  PackageOpen,
} from "lucide-react";

import isoSvg from "../../assets/file-icons/iso.svg";
import mp3Svg from "../../assets/file-icons/mp3.svg";
import mp4Svg from "../../assets/file-icons/mp4.svg";
import winrarSvg from "../../assets/file-icons/winrar.svg";
import zipSvg from "../../assets/file-icons/zip.svg";

type FileIconGroup = {
  label: string;
  className: string;
  icon: typeof File;
  svg?: string;
};

const groups: Record<string, FileIconGroup> = {
  pdf: { label: "PDF", className: "pdf", icon: FileText },
  doc: { label: "DOC", className: "doc", icon: FileText },
  docx: { label: "DOC", className: "doc", icon: FileText },
  txt: { label: "TXT", className: "text", icon: FileText },
  xls: { label: "XLS", className: "sheet", icon: FileText },
  xlsx: { label: "XLS", className: "sheet", icon: FileText },
  pptx: { label: "PPT", className: "slides", icon: FileText },

  zip: { label: "ZIP", className: "zip", icon: Archive, svg: zipSvg },
  rar: { label: "RAR", className: "rar", icon: PackageOpen, svg: winrarSvg },
  "7z": { label: "7Z", className: "sevenzip", icon: Boxes, svg: winrarSvg },
  tar: { label: "TAR", className: "tar", icon: FileArchive, svg: winrarSvg },
  gz: { label: "GZ", className: "gzip", icon: FileArchive, svg: winrarSvg },
  tgz: { label: "TGZ", className: "gzip", icon: FileArchive, svg: winrarSvg },
  bz2: { label: "BZ2", className: "gzip", icon: FileArchive, svg: winrarSvg },
  xz: { label: "XZ", className: "gzip", icon: FileArchive, svg: winrarSvg },

  mp3: { label: "MP3", className: "audio", icon: FileAudio, svg: mp3Svg },
  wav: { label: "WAV", className: "audio", icon: FileAudio, svg: mp3Svg },
  flac: { label: "FLAC", className: "audio", icon: FileAudio, svg: mp3Svg },
  ogg: { label: "OGG", className: "audio", icon: FileAudio, svg: mp3Svg },
  aac: { label: "AAC", className: "audio", icon: FileAudio, svg: mp3Svg },
  m4a: { label: "M4A", className: "audio", icon: FileAudio, svg: mp3Svg },
  wma: { label: "WMA", className: "audio", icon: FileAudio, svg: mp3Svg },

  mp4: { label: "MP4", className: "video", icon: FileVideo, svg: mp4Svg },
  mkv: { label: "MKV", className: "video", icon: FileVideo, svg: mp4Svg },
  mov: { label: "MOV", className: "video", icon: FileVideo, svg: mp4Svg },
  avi: { label: "AVI", className: "video", icon: FileVideo, svg: mp4Svg },
  webm: { label: "WEBM", className: "video", icon: FileVideo, svg: mp4Svg },
  flv: { label: "FLV", className: "video", icon: FileVideo, svg: mp4Svg },
  wmv: { label: "WMV", className: "video", icon: FileVideo, svg: mp4Svg },

  exe: { label: "EXE", className: "app", icon: FileCode2 },
  msi: { label: "MSI", className: "installer", icon: PackageOpen },
  apk: { label: "APK", className: "android", icon: PackageOpen },
  bat: { label: "BAT", className: "script", icon: FileCode2 },

  png: { label: "PNG", className: "image", icon: FileImage },
  jpg: { label: "JPG", className: "image", icon: FileImage },
  jpeg: { label: "JPG", className: "image", icon: FileImage },
  webp: { label: "WEBP", className: "image", icon: FileImage },
  gif: { label: "GIF", className: "image", icon: FileImage },

  iso: { label: "ISO", className: "disc", icon: PackageOpen, svg: isoSvg },
  bin: { label: "BIN", className: "binary", icon: FileCode2, svg: isoSvg },
  img: { label: "IMG", className: "disc", icon: PackageOpen, svg: isoSvg },
  nrg: { label: "NRG", className: "disc", icon: PackageOpen, svg: isoSvg },
  torrent: { label: "TOR", className: "torrent", icon: Boxes },
};

export function FileIcon({ extension }: { extension: string | null }) {
  const normalized = extension?.toLowerCase() ?? "";
  const group = groups[normalized] ?? {
    label: (extension ?? "FILE").slice(0, 4).toUpperCase(),
    className: "generic",
    icon: File,
  };

  if (group.svg) {
    return (
      <div className={`styled-file-icon styled-file-icon--svg styled-file-icon--${group.className}`}>
        <img src={group.svg} alt={group.label} className="styled-file-svg-img" />
      </div>
    );
  }

  const Icon = group.icon;
  return (
    <div className={`styled-file-icon styled-file-icon--${group.className}`}>
      <Icon size={24} />
      <b>{group.label}</b>
    </div>
  );
}
