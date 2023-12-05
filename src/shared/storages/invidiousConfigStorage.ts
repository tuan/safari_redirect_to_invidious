import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';

type Config = {
  host: string;
  autoRedirectEnabled: boolean;
};

const DEFAULT_CONFIG: Config = {
  host: 'https://yewtu.be',
  autoRedirectEnabled: false,
};

type InvidiousConfigStorage = BaseStorage<Config> & {
  toggleAutoRedirect: () => void;
  setHost: (host: string) => void;
  getHost: () => Promise<string>;
  isAutoRedirectEnabled: () => Promise<boolean>;
};

const storage = createStorage<Config>('invidious-config-storage-key', DEFAULT_CONFIG, {
  storageType: StorageType.Local,
});

const invidiousConfigStorage: InvidiousConfigStorage = {
  ...storage,
  toggleAutoRedirect() {
    storage.set(currentConfig => {
      return { ...currentConfig, autoRedirectEnabled: !currentConfig.autoRedirectEnabled };
    });
  },
  setHost(newHost) {
    storage.set(currentConfig => {
      return { ...currentConfig, host: newHost };
    });
  },
  getHost() {
    return storage.get().then(config => config.host);
  },
  isAutoRedirectEnabled() {
    return storage.get().then(config => config.autoRedirectEnabled);
  },
};

export default invidiousConfigStorage;
