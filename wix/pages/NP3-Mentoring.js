/**
 * ISC GROUP — NP3 Mentoring — CP02 v0.2.0 (2026-10-19)
 * Wiring only. Keeps HTML #html1, videos, NP4/NP5 names, READY/PING,
 * popup ACK/FAIL and design exactly as approved.
 * Depends on backend/iscMentoring.web.js installed in Wix Velo.
 */
import wixData from 'wix-data';
import wixWindowFrontend from 'wix-window-frontend';
import {
  getMyMentoringProfile,
  saveMyMentoringProfile,
  listPublicMentoringMembers,
  getPublicMemberProfile,
  saveMentoringFeedback
} from 'backend/iscMentoring.web';

const HTML_ID = '#html1';
const VIDEO_COLLECTION = 'MentoringIntroVideos';
const VIDEO_POPUP = 'NP4 - Video Player';
const PROFILE_POPUP = 'NP5 - Profile Details';
const HTML_SOURCE = 'ISC_MENTORING';
const WIX_SOURCE = 'ISC_MENTORING_WIX';
const GUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

let videosLoaded = false;
let videoPopupOpen = false;
let profilePopupOpen = false;
let savingProfile = false;
let savingFeedback = false;
let handshakeInterval;
let htmlReady = false;

function sendToHtml(type, payload = null) {
  $w(HTML_ID).postMessage({ source: WIX_SOURCE, type, payload });
}

function isValidVideoUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    const allowedHosts = [
      'video.wixstatic.com',
      'youtube.com', 'www.youtube.com', 'm.youtube.com',
      'youtu.be', 'youtube-nocookie.com', 'www.youtube-nocookie.com',
      'vimeo.com', 'www.vimeo.com', 'player.vimeo.com'
    ];
    return url.protocol === 'https:' && allowedHosts.includes(url.hostname.toLowerCase());
  } catch (error) {
    return false;
  }
}

async function loadMentoringVideos() {
  if (videosLoaded) return;
  videosLoaded = true;
  try {
    const result = await wixData.query(VIDEO_COLLECTION)
      .eq('isActive', true)
      .ascending('sortOrder')
      .limit(100)
      .find();
    // Keep original Wix video fields, including thumbnail and subtitle.
    const videos = (result.items || []).filter(item => isValidVideoUrl(item.videoUrl));
    sendToHtml('SET_VIDEOS', videos);
  } catch (error) {
    videosLoaded = false;
    console.error('[ISC NP3] Error loading mentoring videos:', error);
  }
}

async function loadDirectory() {
  try {
    const list = await listPublicMentoringMembers();
    // Replaces approved HTML's static demo members; only server-approved records.
    sendToHtml('SET_MEMBERS', Array.isArray(list) ? list : []);
  } catch (error) {
    sendToHtml('SET_MEMBERS', []);
    console.warn('[ISC NP3] Directory unavailable (login required):', error);
  }
}

async function loadOwnProfile() {
  try {
    const profile = await getMyMentoringProfile();
    // IMPORTANT: frozen HTML does not listen for SET_MY_PROFILE.
    // Do NOT claim that registration-data prefilling works yet.
    // Keep this backend request to bootstrap a newly registered member.
    console.info('[ISC NP3] Own profile loaded:', Boolean(profile?.id));
  } catch (error) {
    console.warn('[ISC NP3] Own profile unavailable (login required):', error);
  }
}

async function openVideoPopup(payload) {
  if (videoPopupOpen || !payload) return;
  const videoUrl = String(payload.videoUrl || '').trim();
  if (!isValidVideoUrl(videoUrl)) {
    console.error('[ISC NP3] Invalid video URL');
    return;
  }
  videoPopupOpen = true;
  try {
    await wixWindowFrontend.openLightbox(VIDEO_POPUP, {
      title: String(payload.title || payload.subtitle || 'ISC Group Video').slice(0, 140),
      videoUrl
    });
  } catch (error) {
    console.error('[ISC NP3] Error opening video popup:', error);
  } finally {
    videoPopupOpen = false;
  }
}

async function openProfilePopup(payload) {
  // Data coming from HTML can be modified by a visitor. Never trust it for identity.
  const memberId = String(payload?.id || '').trim();
  if (!GUID.test(memberId)) {
    sendToHtml('PROFILE_OPEN_FAILED', { id: memberId });
    return;
  }
  if (profilePopupOpen) return;
  profilePopupOpen = true;
  // ACK preserves the locked iframe's 3-second timer while the backend verifies.
  sendToHtml('PROFILE_OPEN_ACK', { id: memberId });
  try {
    const authorized = await getPublicMemberProfile(memberId);
    if (!authorized || authorized.id !== memberId) throw new Error('Profile access denied');
    // NP5 independently fetches the authorized profile using memberId.
    await wixWindowFrontend.openLightbox(PROFILE_POPUP, { memberId });
  } catch (error) {
    console.error('[ISC NP3] Error opening authorized profile:', error);
    sendToHtml('PROFILE_OPEN_FAILED', { id: memberId });
  } finally {
    profilePopupOpen = false;
  }
}

async function saveProfile(payload) {
  if (savingProfile) return;
  savingProfile = true;
  try {
    const result = await saveMyMentoringProfile(payload);
    sendToHtml('SAVE_RESULT', { success: result?.success === true });
    if (result?.success) await loadDirectory();
  } catch (error) {
    console.error('[ISC NP3] Profile saving failed:', error);
    sendToHtml('SAVE_RESULT', {
      success: false,
      message: String(error?.message || 'Unable to save profile.').slice(0, 160)
    });
  } finally {
    savingProfile = false;
  }
}

async function saveFeedback(payload) {
  if (savingFeedback) return;
  savingFeedback = true;
  try {
    const result = await saveMentoringFeedback(payload);
    sendToHtml('SAVE_RESULT', { success: result?.success === true });
  } catch (error) {
    console.error('[ISC NP3] Feedback saving failed:', error);
    sendToHtml('SAVE_RESULT', {
      success: false,
      message: String(error?.message || 'Unable to save feedback.').slice(0, 160)
    });
  } finally {
    savingFeedback = false;
  }
}

$w.onReady(function () {
  const html = $w(HTML_ID);
  html.onMessage(function (event) {
    const message = event.data;
    if (!message || message.source !== HTML_SOURCE) return;
    switch (message.type) {
      case 'READY':
        if (!htmlReady) {
          htmlReady = true;
          if (handshakeInterval) clearInterval(handshakeInterval);
          sendToHtml('SET_MEMBERS', []); // Clear sample profiles immediately.
          void loadMentoringVideos();
          void loadDirectory();
          void loadOwnProfile();
        }
        break;
      case 'OPEN_VIDEO':
        void openVideoPopup(message.payload);
        break;
      case 'OPEN_PROFILE':
        void openProfilePopup(message.payload);
        break;
      case 'PROFILE_SAVE_REQUEST':
        void saveProfile(message.payload);
        break;
      case 'FEEDBACK_SAVE_REQUEST':
        void saveFeedback(message.payload);
        break;
      case 'HEIGHT':
        // Frozen layout: no changes to component size or scroll geometry.
        break;
      default:
        break;
    }
  });

  let attempts = 0;
  sendToHtml('PING');
  handshakeInterval = setInterval(function () {
    if (htmlReady || attempts >= 20) {
      clearInterval(handshakeInterval);
      return;
    }
    attempts += 1;
    sendToHtml('PING');
  }, 350);
});
