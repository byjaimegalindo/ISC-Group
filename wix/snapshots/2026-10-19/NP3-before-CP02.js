/**
 * NP3 Velo source supplied by user in chat on 2026-10-19, normalized whitespace
 * and chat Markdown escaping for versioned rollback. NOT a byte-identical export
 * of Wix Editor. Use alongside original user message when rolling back.
 */
import wixData from 'wix-data';
import wixWindowFrontend from 'wix-window-frontend';

const HTML_ID = '#html1';
const VIDEO_COLLECTION = 'MentoringIntroVideos';
const VIDEO_POPUP = 'NP4 - Video Player';
const PROFILE_POPUP = 'NP5 - Profile Details';

let videosLoaded = false;
let videoPopupOpen = false;
let profilePopupOpen = false;
let handshakeInterval;

function sendToHtml(type, payload = null) {
  $w(HTML_ID).postMessage({source:'ISC_MENTORING_WIX',type,payload});
}
function isValidVideoUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    const allowedHosts = [
      'video.wixstatic.com', 'youtube.com', 'www.youtube.com', 'm.youtube.com',
      'youtu.be', 'youtube-nocookie.com', 'www.youtube-nocookie.com',
      'vimeo.com', 'www.vimeo.com', 'player.vimeo.com'
    ];
    return url.protocol === 'https:' && allowedHosts.includes(url.hostname.toLowerCase());
  } catch (error) {return false;}
}
async function loadMentoringVideos() {
  if (videosLoaded) return;
  videosLoaded = true;
  try {
    const result = await wixData.query(VIDEO_COLLECTION)
      .eq('isActive',true).ascending('sortOrder').limit(100).find();
    const videos=result.items.filter(item=>isValidVideoUrl(item.videoUrl));
    sendToHtml('SET_VIDEOS',videos);
  } catch(error) {
    videosLoaded=false;
    console.error('Error loading mentoring videos:',error);
  }
}
function uniqueStrings(value) {
  return Array.isArray(value)?[...new Set(value.map(x=>String(x||'').trim()).filter(Boolean))]:[];
}
function normalizeRoleData(roleData={}) {
  const source=roleData||{};
  return {
    careerLevel:uniqueStrings(source['CAREER LEVEL']||source.careerLevel||source.career||source.levels),
    function:uniqueStrings(source['FUNCTION']||source.function||source.functions),
    area:uniqueStrings(source['AREA']||source.area||source.areas),
    bio:String(source.bio||source.description||source.summary||'').trim()
  };
}
function normalizeProfile(payload) {
  if(!payload||typeof payload!=='object')return null;
  return {
    id:String(payload.id||'').trim(),firstName:String(payload.firstName||'').trim(),
    lastName:String(payload.lastName||'').trim(),company:String(payload.company||'').trim(),
    jobTitle:String(payload.jobTitle||'').trim(),email:String(payload.email||'').trim(),
    photo:String(payload.photo||'').trim(),roles:uniqueStrings(payload.roles),
    types:uniqueStrings(payload.types),mentor:normalizeRoleData(payload.mentor),
    mentee:normalizeRoleData(payload.mentee)
  };
}
async function openVideoPopup(payload) {
  if(videoPopupOpen||!payload)return;
  const videoUrl=String(payload.videoUrl||'').trim();
  if(!isValidVideoUrl(videoUrl)){console.error('Invalid video URL');return;}
  videoPopupOpen=true;
  try {
    await wixWindowFrontend.openLightbox(VIDEO_POPUP,{
      title:String(payload.title||payload.subtitle||'ISC Group Video'),videoUrl
    });
  } catch(error) {console.error('Error opening video popup:',error);}
  finally {videoPopupOpen=false;}
}
async function openProfilePopup(payload) {
  const profile=normalizeProfile(payload);
  if(!profile||!profile.id){sendToHtml('PROFILE_OPEN_FAILED',{id:payload?.id||''});return;}
  sendToHtml('PROFILE_OPEN_ACK',{id:profile.id});
  if(profilePopupOpen)return;
  profilePopupOpen=true;
  try {await wixWindowFrontend.openLightbox(PROFILE_POPUP,{profile});}
  catch(error){
    console.error('Error opening profile popup:',error);
    sendToHtml('PROFILE_OPEN_FAILED',{id:profile.id});
  } finally {profilePopupOpen=false;}
}
$w.onReady(function () {
  const html=$w(HTML_ID);
  let htmlReady=false;
  html.onMessage(async function(event){
    const message=event.data;
    if(!message||message.source!=='ISC_MENTORING')return;
    switch(message.type){
      case 'READY':
        htmlReady=true;
        if(handshakeInterval)clearInterval(handshakeInterval);
        await loadMentoringVideos();
        break;
      case 'OPEN_VIDEO':await openVideoPopup(message.payload);break;
      case 'OPEN_PROFILE':await openProfilePopup(message.payload);break;
      default:break;
    }
  });
  let attempts=0;
  sendToHtml('PING');
  handshakeInterval=setInterval(()=>{
    if(htmlReady||attempts>=20){clearInterval(handshakeInterval);return;}
    attempts++;
    sendToHtml('PING');
  },350);
});
