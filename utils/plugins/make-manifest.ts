import * as fs from 'fs';
import * as path from 'path';
import colorLog from '../log';
import ManifestParser from '../manifest-parser';
import type { PluginOption } from 'vite';
import url from 'url';
import * as process from 'process';
import { exec } from 'child_process';

const { resolve } = path;

const rootDir = resolve(__dirname, '..', '..');
const distDir = resolve(rootDir, 'dist');
const manifestFile = resolve(rootDir, 'manifest.js');

const getManifestWithCacheBurst = (): Promise<{ default: chrome.runtime.ManifestV3 }> => {
  const withCacheBurst = (path: string) => `${path}?${Date.now().toString()}`;
  /**
   * In Windows, import() doesn't work without file:// protocol.
   * So, we need to convert path to file:// protocol. (url.pathToFileURL)
   */
  if (process.platform === 'win32') {
    return import(withCacheBurst(url.pathToFileURL(manifestFile).href));
  }
  return import(withCacheBurst(manifestFile));
};

export default function makeManifest(config: { contentScriptCssKey?: string }): PluginOption {
  function makeManifest(manifest: chrome.runtime.ManifestV3, to: string) {
    if (!fs.existsSync(to)) {
      fs.mkdirSync(to);
    }
    const manifestPath = resolve(to, 'manifest.json');

    // Naming change for cache invalidation
    if (config.contentScriptCssKey) {
      manifest.content_scripts.forEach(script => {
        script.css = script.css.map(css => css.replace('<KEY>', config.contentScriptCssKey));
      });
    }

    fs.writeFileSync(manifestPath, ManifestParser.convertManifestToString(manifest));

    colorLog(`Manifest file copy complete: ${manifestPath}`, 'success');

    const xcodeproj = resolve(rootDir, '..', 'Invidious Redirect', 'Invidious Redirect.xcodeproj');
    const child = exec(`xcodebuild -scheme "Invidious Redirect" -project "${xcodeproj}" build`);

    child.on('close', code => {
      console.log(`xcodebuild process exited with code ${code}`);
    });
  }

  return {
    name: 'make-manifest',
    buildStart() {
      this.addWatchFile(manifestFile);
    },
    async writeBundle() {
      const manifest = await getManifestWithCacheBurst();
      makeManifest(manifest.default, distDir);
    },
  };
}
