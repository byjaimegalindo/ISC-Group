/**
 * ISC NP3: COMPLETE MERGE REFERENCE based on 16 October historical NP3.
 * DO NOT overwrite current page code unless the page source is compared first.
 * HTML frozen, Wix HTML Component expected: #html1 (verify in editor).
 * NP4 lightbox name verified in historical code.
 * NP5 lightbox name is NOT verified in editor: update only this one constant.
 */
import wixWindowFrontend from 'wix-window-frontend';
import wixData from 'wix-data';
import {
  getMyMentoringProfile,
  saveMyMentoringProfile,
  listPublicMentoringMembers,
  getPublicMemberProfile,
  saveMentoringFeedback
} from 'backend/iscMentoring.web';

const MAIN_HTML = '#html1';
const VIDEO_POPUP_NAME = 'NP4 - Video Player';
const PROFILE_POPUP_NAME = 'NP5 - Profile Details'; // VERIFY EXACT EDITOR NAME
const VIDEO_COLLECTION = 'MentoringIntroVideos';
let htmlReady = false;
let openingVideo = false;
let openingProfile = false;
let handshakeTimer;

function sendToHtml(type, payload = null) {
  $w(MAIN_HTML).postMessage({source:'ISC_MENTORING_WIX',type,payload});
}

function validVideoUrl(value) {
  if (typeof value !== 'string') return '';
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:') return '';
    const allowedHosts = [
      'video.wixstatic.com','youtube.com','www.youtube.com','m.youtube.com',
      'youtu.be','youtube-nocookie.com','www.youtube-nocookie.com',
      'vimeo.com','www.vimeo.com','player.vimeo.com'
    ];
    return allowedHosts.includes(url.hostname.toLowerCase()) ? url.href : '';
  } catch {return '';}
}

async function loadExistingVideos() {
  try {
    const r = await wixData.query(VIDEO_COLLECTION)
      .eq('isActive',true).ascending('sortOrder').limit(100).find();
    const videos = (r.items||[]).map(item=>({
      title:String(item.title||''),
      subtitle:String(item.subtitle||item.title||''),
      description:String(item.description||''),
      videoUrl:validVideoUrl(item.videoUrl),
      thumbnail:typeof item.thumbnail === 'string'?item.thumbnail:'',
      sortOrder:Number(item.sortOrder)||0,
      isActive:item.isActive===true
    })).filter(v=>v.videoUrl);
    if (videos.length) sendToHtml('SET_VIDEOS',videos);
  } catch(error) { console.error('[ISC NP3] Videos:',error); }
}

async function loadDirectory() {
  try {
    const list = await listPublicMentoringMembers();
    sendToHtml('SET_MEMBERS',Array.isArray(list)?list:[]);
  } catch(error) {
    // Critical: replace sampleMembers with an empty list on denied/error access.
    sendToHtml('SET_MEMBERS',[]);
    console.error('[ISC NP3] Directory:',error);
  }
}

async function loadOwnProfile() {
  try {
    const own = await getMyMentoringProfile();
    // The current frozen HTML DOES NOT listen for SET_MY_PROFILE.
    // No message sent: never claim that registration data pre-fills UI.
    console.info('[ISC NP3] Own profile loaded in Velo; HTML hydration is blocked by freeze.',Boolean(own?.id));
  } catch(error) { console.warn('[ISC NP3] Own profile:',error); }
}

async function openNativeVideoPopup(payload) {
  if (openingVideo) return;
  const url = validVideoUrl(payload?.videoUrl);
  if (!url) return;
  openingVideo = true;
  try {
    await wixWindowFrontend.openLightbox(VIDEO_POPUP_NAME,{
      title:String(payload?.title||'ISC Group Video').slice(0,140),videoUrl:url
    });
  } catch(error) {console.error('[ISC NP3] NP4:',error);}
  finally {openingVideo=false;}
}

async function handleProfileOpen(payload) {
  const memberId = String(payload?.id||'');
  if (!/^[a-f0-9-]{36}$/i.test(memberId)) {
    sendToHtml('PROFILE_OPEN_FAILED',{id:memberId});return;
  }
  if (openingProfile) return;
  openingProfile=true;
  try {
    // Backend validates real auth and public visibility, ignores profile fields from iframe.
    const record = await getPublicMemberProfile(memberId);
    if (record.id !== memberId) throw new Error('Mismatch');
    const completion = wixWindowFrontend.openLightbox(PROFILE_POPUP_NAME,{memberId});
    sendToHtml('PROFILE_OPEN_ACK',{id:memberId});
    await completion; // OpenLightbox promise resolves when user closes popup.
  } catch(error) {
    console.error('[ISC NP3] NP5:',error);
    sendToHtml('PROFILE_OPEN_FAILED',{id:memberId});
  } finally {openingProfile=false;}
}

async function handleProfileSave(payload) {
  try {
    const answer = await saveMyMentoringProfile(payload);
    sendToHtml('SAVE_RESULT',{success:answer?.success===true});
    if (answer?.success) await loadDirectory();
  } catch(error) {
    console.error('[ISC NP3] Profile SAVE:',error);
    sendToHtml('SAVE_RESULT',{success:false,message:String(error?.message||'Unable to save profile').slice(0,160)});
  }
}

async function handleFeedbackSave(payload) {
  try {
    const answer = await saveMentoringFeedback(payload);
    sendToHtml('SAVE_RESULT',{success:answer?.success===true});
  } catch(error) {
    console.error('[ISC NP3] Feedback SAVE:',error);
    sendToHtml('SAVE_RESULT',{success:false,message:String(error?.message||'Unable to save feedback').slice(0,160)});
  }
}

$w.onReady(function () {
  const html=$w(MAIN_HTML);
  html.onMessage(event=>{
    const m=event.data;
    if (!m || m.source!=='ISC_MENTORING') return;
    switch(m.type) {
      case 'READY':
        if (!htmlReady) {
          htmlReady=true;
          if(handshakeTimer)clearInterval(handshakeTimer);
          loadExistingVideos();
          loadDirectory();
          loadOwnProfile();
        }
        break;
      case 'OPEN_VIDEO':openNativeVideoPopup(m.payload);break;
      case 'OPEN_PROFILE':handleProfileOpen(m.payload);break;
      case 'PROFILE_SAVE_REQUEST':handleProfileSave(m.payload);break;
      case 'FEEDBACK_SAVE_REQUEST':handleFeedbackSave(m.payload);break;
      case 'HEIGHT':
        // Height is intentionally observed only; changing iframe dimensions
        // before parity tests would violate the visual freeze.
        break;
      default:break;
    }
  });
  let attempts=0;
  sendToHtml('PING');
  handshakeTimer=setInterval(()=>{
    if(htmlReady||++attempts>=20){clearInterval(handshakeTimer);return;}
    sendToHtml('PING');
  },300);
});
