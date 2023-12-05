import invidiousConfigStorage from '@root/src/shared/storages/invidiousConfigStorage';
import { extractVideoId, redirectToInvidious } from '@root/src/shared/utils';
import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');

async function onTabUpdated(_tabId, _changeInfo, tab: browser.tabs.Tab) {
  const isAutoRedirectEnabled = await invidiousConfigStorage.isAutoRedirectEnabled();
  if (!isAutoRedirectEnabled) {
    return;
  }

  const tabUrl = tab.url?.trim();
  if (tabUrl == null) {
    return;
  }

  const videoId = extractVideoId(tabUrl);
  if (videoId == null) {
    return;
  }

  redirectToInvidious(videoId);
}
browser.tabs.onUpdated.addListener(onTabUpdated, {
  urls: ['*://*.youtube.com/*', '*://*.youtu.be/*'],
});

function onActionClicked({ url }: browser.tabs.Tab) {
  const videoId = extractVideoId(url);
  if (videoId == null) {
    return;
  }

  redirectToInvidious(videoId);
}
browser.action.onClicked.addListener(onActionClicked);
