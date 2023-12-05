import invidiousConfigStorage from './storages/invidiousConfigStorage';

export function extractVideoId(url: string): string | null {
  // Regular expression to match YouTube video ID
  const regex =
    /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{5,})/;

  // Extract video ID using the regular expression
  const match = url.match(regex);

  // Return the video ID or null if no match
  return match ? match[1] : null;
}

export async function getCurrentVideoId(): Promise<string | null> {
  const { url } = await browser.tabs.getCurrent();
  if (url == null) {
    return null;
  }

  return extractVideoId(url);
}

export async function redirectToInvidious(videoId: string) {
  const host = await invidiousConfigStorage.getHost();
  try {
    const invidiusUrl = new URL('watch', host);
    invidiusUrl.searchParams.set('v', videoId);

    browser.tabs.update({ url: invidiusUrl.toString(), active: true });
  } catch (e) {
    console.warn('Failed to parse host url in config. Host: ', host);
  }
}
