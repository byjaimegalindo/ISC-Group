/**
 * ISC GROUP — NP5 Profile Details — CP02 v0.2.0 (2026-10-19)
 * Keeps approved popup HTML, element ID #html-Profile and message protocol.
 * Resolves real memberId via secure backend. No visual/scroll changes.
 */
import { lightbox } from 'wix-window-frontend';
import wixLocationFrontend from 'wix-location-frontend';
import { getPublicMemberProfile } from 'backend/iscMentoring.web';

const HTML_ID = '#html-Profile';
const GUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
let profile = null;
let iframeReady = false;

function sendProfile() {
  if (!iframeReady || !profile) return;
  $w(HTML_ID).postMessage({
    source: 'ISC_PROFILE_WIX',
    type: 'SET_PROFILE',
    payload: profile
  });
}

$w.onReady(function () {
  const html = $w(HTML_ID);
  const context = lightbox.getContext() || {};
  const memberId = String(context.memberId || '').trim();

  html.onMessage(function (event) {
    const message = event.data;
    if (!message || message.source !== 'ISC_PROFILE_HTML') return;
    switch (message.type) {
      case 'READY':
        iframeReady = true;
        sendProfile();
        break;
      case 'CLOSE':
        lightbox.close();
        break;
      case 'CONTACT': {
        // Never follow an email supplied by the iframe; use the backend result.
        const email = String(profile?.email || '').trim();
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          wixLocationFrontend.to('mailto:' + encodeURIComponent(email));
        }
        break;
      }
      case 'HEIGHT':
        // Deliberately ignored; approved scrollbar and popup geometry are frozen.
        break;
      default:
        break;
    }
  });

  if (!GUID.test(memberId)) {
    console.error('[ISC NP5] Profile context missing/invalid memberId.');
    return;
  }

  void getPublicMemberProfile(memberId)
    .then(function (authorizedProfile) {
      if (!authorizedProfile || authorizedProfile.id !== memberId) {
        throw new Error('Profile access denied');
      }
      profile = authorizedProfile;
      sendProfile();
    })
    .catch(function (error) {
      console.error('[ISC NP5] Could not load authorized profile:', error);
    });
});
