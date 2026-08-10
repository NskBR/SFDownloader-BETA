import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");
const releaseDir = path.join(rootDir, "release");
const tauriTargetDir = path.join(rootDir, "src-tauri", "target", "release");

const tauriConf = JSON.parse(fs.readFileSync(path.join(rootDir, "src-tauri", "tauri.conf.json"), "utf8"));
const currentVersion = tauriConf.version;

console.log("==================================================");
console.log(`🚀 Iniciando Build do SFDownloader v${currentVersion}...`);
console.log("==================================================");

try {
  // 1. Executar Tauri Build
  execSync("npx tauri build", { cwd: rootDir, stdio: "inherit" });

  // 2. Limpar e recriar a pasta release/
  if (fs.existsSync(releaseDir)) {
    fs.rmSync(releaseDir, { recursive: true, force: true });
  }
  fs.mkdirSync(releaseDir, { recursive: true });

  const bundleDir = path.join(tauriTargetDir, "bundle");
  const allInstallerFiles = [];

  // Coletar todos os instaladores gerados na pasta bundle/
  if (fs.existsSync(bundleDir)) {
    const searchFolderRecursive = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          searchFolderRecursive(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (ext === ".exe" || ext === ".msi" || ext === ".zip") {
            const versionMatch = entry.name.match(/(\d+\.\d+\.\d+)/);
            if (versionMatch) {
              allInstallerFiles.push({
                name: entry.name,
                fullPath,
                version: versionMatch[1],
              });
            }
          }
        }
      }
    };
    searchFolderRecursive(bundleDir);
  }

  // Extrair e ordenar semver
  const parseVersion = (v) => v.split(".").map((n) => parseInt(n, 10) || 0);
  const uniqueVersions = [...new Set(allInstallerFiles.map((f) => f.version))].sort((a, b) => {
    const pa = parseVersion(a);
    const pb = parseVersion(b);
    if (pa[0] !== pb[0]) return pa[0] - pb[0];
    if (pa[1] !== pb[1]) return pa[1] - pb[1];
    return pa[2] - pb[2];
  });

  // Garantir que a versão atual (currentVersion) está na lista
  if (!uniqueVersions.includes(currentVersion)) {
    uniqueVersions.push(currentVersion);
  }

  // Selecionar apenas a última versão (atual) e a penúltima
  const latestVersion = uniqueVersions[uniqueVersions.length - 1];
  const penultimateVersion = uniqueVersions.length > 1 ? uniqueVersions[uniqueVersions.length - 2] : null;

  const allowedVersions = new Set([latestVersion, penultimateVersion].filter(Boolean));

  console.log(`\n📦 Organizando pasta release/...`);
  console.log(`📌 Mantendo apenas versão atual (v${latestVersion})${penultimateVersion ? ` e penúltima versão (v${penultimateVersion})` : ""}`);

  const copiedFiles = [];

  // Copiar o executável standalone principal (SFDownloader.exe) se existir
  const mainExe = path.join(tauriTargetDir, "SFDownloader.exe");
  if (fs.existsSync(mainExe)) {
    const destExe = path.join(releaseDir, "SFDownloader.exe");
    fs.copyFileSync(mainExe, destExe);
    copiedFiles.push(destExe);
  }

  // Copiar instaladores da versão atual e da penúltima
  for (const file of allInstallerFiles) {
    if (allowedVersions.has(file.version)) {
      const destPath = path.join(releaseDir, file.name);
      fs.copyFileSync(file.fullPath, destPath);
      copiedFiles.push(destPath);
    }
  }

  console.log("==================================================");
  console.log(`✅ Processo de release concluído com sucesso!`);
  console.log(`📁 Arquivos copiados para /release:\n`);
  copiedFiles.forEach((file) => console.log(`   👉 ${path.basename(file)}`));
  console.log("==================================================");
} catch (error) {
  console.error("\n❌ Erro durante o processo de release:", error);
  process.exit(1);
}
