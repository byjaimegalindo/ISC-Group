/**
 * ISC GROUP | NP3 - New FunctionalityA | Velo completo
 * Objetivo actual: abrir videos de la pestaña 1 en NP4 - Video Player.
 * No guarda perfiles, no altera el diseño y no crea colecciones.
 *
 * HTML principal: #html1
 * Popup nativo: NP4 - Video Player
 * CMS existente: MentoringIntroVideos
 */
import wixWindowFrontend from 'wix-window-frontend';
import wixData from 'wix-data';

const MAIN_HTML = '#html1';
const VIDEO_POPUP_NAME = 'NP4 - Video Player';
const VIDEO_COLLECTION = 'MentoringIntroVideos';

let htmlReady = false;
let openingVideo = false;
let handshakeTimer;

function sendToHtml(type, payload = null) {
  $w(MAIN_HTML).postMessage({
    source: 'ISC_MENTORING_WIX',
    type,
    payload
  });
}

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

async function loadExistingVideos() {
  try {
    const result = await wixData
      .query(VIDEO_COLLECTION)
      .eq('isActive', true)
      .ascending('sortOrder')
      .limit(100)
      .find();

    const videos = (result.items || [])
      .map((item) => ({
        title: String(item.title || ''),
        subtitle: String(item.subtitle || item.title || ''),
        description: String(item.description || ''),
        videoUrl: validVideoUrl(item.videoUrl),
        thumbnail: typeof item.thumbnail === 'string' ? item.thumbnail : '',
        sortOrder: Number(item.sortOrder) || 0,
        isActive: item.isActive === true
      }))
      .filter((item) => item.videoUrl);

    // If CMS can't be read or has no active videos, the approved HTML keeps
    // its original 3 fallback videos and approved texts/appearance.
    if (videos.length > 0) {
      sendToHtml('SET_VIDEOS', videos);
    }
  } catch (error) {
    console.error('[ISC NP3] Could not read MentoringIntroVideos:', error);
  }
}

async function openNativeVideoPopup(payload) {
  if (openingVideo) return;

  const url = validVideoUrl(payload && payload.videoUrl);
  if (!url) {
    console.warn('[ISC NP3] Rejected invalid video URL.');
    return;
  }

  const title = String((payload && payload.title) || 'ISC Group Video').slice(0, 140);
  openingVideo = true;

  try {
    await wixWindowFrontend.openLightbox(VIDEO_POPUP_NAME, {
      title,
      videoUrl: url
    });
  } catch (error) {
    console.error('[ISC NP3] Could not open NP4 - Video Player:', error);
  } finally {
    openingVideo = false;
  }
}

$w.onReady(function () {
  const html = $w(MAIN_HTML);

  html.onMessage((event) => {
    const message = event.data;
    if (!message || message.source !== 'ISC_MENTORING') return;

    switch (message.type) {
      case 'READY':
        if (!htmlReady) {
          htmlReady = true;
          if (handshakeTimer) clearInterval(handshakeTimer);
          loadExistingVideos();
        }
        break;

      case 'OPEN_VIDEO':
        openNativeVideoPopup(message.payload);
        break;

      // Other events will be wired in later approved phases.
      // HEIGHT, PROFILE_SAVE_REQUEST, FEEDBACK_SAVE_REQUEST remain untouched.
      default:
        break;
    }
  });

  // Race-safe handshake: Wix can finish loading the iframe before page onReady.
  // The approved HTML v2.3 responds to PING with READY.
  let attempts = 0;
  sendToHtml('PING');
  handshakeTimer = setInterval(() => {
    if (htmlReady || ++attempts >= 20) {
      clearInterval(handshakeTimer);
      return;
    }
    sendToHtml('PING');
  }, 300);
});
