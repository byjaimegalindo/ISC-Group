/**
 * ISC NP5 lightbox Velo code — reference, NOT installed.
 * Existing lightbox HTML element ID is UNKNOWN. Verify before pasting.
 * Frozen popup listens for SET_PROFILE and emits READY/CONTACT/CLOSE/HEIGHT.
 */
import wixWindowFrontend from 'wix-window-frontend';
import wixLocationFrontend from 'wix-location-frontend';
import { getPublicMemberProfile } from 'backend/iscMentoring.web';

const POPUP_HTML = '#html1'; // VERIFY real NP5 HTML component ID in editor
let model;
let ready=false;

function sendProfile() {
  if (!ready || !model) return;
  $w(POPUP_HTML).postMessage({
    source:'ISC_PROFILE_WIX',
    type:'SET_PROFILE',
    payload:model
  });
}

$w.onReady(async function() {
  const context=wixWindowFrontend.lightbox.getContext();
  const memberId=String(context?.memberId||'');
  const html=$w(POPUP_HTML);
  html.onMessage(event=>{
    const message=event.data;
    if (!message || message.source!=='ISC_PROFILE_HTML') return;
    switch(message.type) {
      case 'READY':ready=true;sendProfile();break;
      case 'CLOSE':wixWindowFrontend.lightbox.close();break;
      case 'CONTACT':
        // Resolve the address from backend, NOT the iframe-provided email.
        if (!model?.email) return;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(model.email)) return;
        wixLocationFrontend.to(`mailto:${model.email}`);
        break;
      case 'HEIGHT':
        // No geometry mutation: popup layout/scroll are approved and frozen.
        break;
      default:break;
    }
  });
  if (!/^[a-f0-9-]{36}$/i.test(memberId)) {
    console.error('[ISC NP5] Invalid popup member ID.');return;
  }
  try {
    model=await getPublicMemberProfile(memberId);
    sendProfile();
  } catch(error) {console.error('[ISC NP5] Profile not available:',error);}
});
