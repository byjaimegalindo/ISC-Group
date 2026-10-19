/**
 * ISC GROUP — NP4 Video Player
 * User-supplied current Wix Velo code, transcribed 2026-10-19.
 * Preservation/reference only: NO CHANGE REQUIRED, do NOT replace in editor.
 */
import { lightbox } from 'wix-window-frontend';

const PLAYER_HTML = '#html-video';
const HTML_SOURCE = 'ISC_VIDEO_PLAYER';
const WIX_SOURCE = 'ISC_WIX_VIDEO_POPUP';

function validVideoUrl(value) {
  if (typeof value !== 'string') return '';
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:') return '';
    const allowedHosts = [
      'video.wixstatic.com',
      'youtube.com',
      'www.youtube.com',
      'm.youtube.com',
      'youtu.be',
      'youtube-nocookie.com',
      'www.youtube-nocookie.com',
      'vimeo.com',
      'www.vimeo.com',
      'player.vimeo.com'
    ];
    return allowedHosts.includes(url.hostname.toLowerCase()) ? url.href : '';
  } catch (error) {
    return '';
  }
}

$w.onReady(function () {
  const player = $w(PLAYER_HTML);
  const context = lightbox.getContext() || {};
  const title = String(context.title || 'ISC Group Video').slice(0, 140);
  const videoUrl = validVideoUrl(context.videoUrl);

  player.onMessage((event) => {
    const message = event.data;
    if (!message || message.source !== HTML_SOURCE) return;
    if (message.type === 'READY') {
      player.postMessage({
        source: WIX_SOURCE,
        type: 'PLAY',
        payload: { title, videoUrl }
      });
    }
    if (message.type === 'CLOSE') {
      lightbox.close();
    }
  });
});
