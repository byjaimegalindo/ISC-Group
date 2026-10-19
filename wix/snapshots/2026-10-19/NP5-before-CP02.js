/**
 * NP5 Velo source supplied by user in chat 2026-10-19, normalized Markdown
 * escaping and whitespace; for rollback only, not a byte-identical Wix export.
 */
import { lightbox } from 'wix-window-frontend';
import wixLocationFrontend from 'wix-location-frontend';

const HTML_ID = '#html-Profile';
function asArray(value) {
  if(Array.isArray(value))return value.map(item=>String(item||'').trim()).filter(Boolean);
  return [];
}
function uniqueStrings(values) {return [...new Set(asArray(values))];}
function normalizeRoleData(roleData={}){
  const source=roleData||{};
  return {
    careerLevel:uniqueStrings(source.careerLevel||source['CAREER LEVEL']||source.career||source.levels),
    function:uniqueStrings(source.function||source['FUNCTION']||source.functions),
    area:uniqueStrings(source.area||source['AREA']||source.areas),
    bio:String(source.bio||source.description||source.summary||'').trim()
  };
}
function normalizeProfile(profile={}){
  return {
    id:String(profile.id||'').trim(),firstName:String(profile.firstName||'').trim(),
    lastName:String(profile.lastName||'').trim(),company:String(profile.company||'').trim(),
    jobTitle:String(profile.jobTitle||'').trim(),email:String(profile.email||'').trim(),
    photo:String(profile.photo||'').trim(),roles:uniqueStrings(profile.roles),
    types:uniqueStrings(profile.types),mentor:normalizeRoleData(profile.mentor),
    mentee:normalizeRoleData(profile.mentee)
  };
}
$w.onReady(function(){
  const html=$w(HTML_ID);
  const context=lightbox.getContext()||{};
  const profile=normalizeProfile(context.profile||context);
  html.onMessage(function(event){
    const message=event.data;
    if(!message||message.source!=='ISC_PROFILE_HTML')return;
    switch(message.type){
      case 'READY':
        html.postMessage({source:'ISC_PROFILE_WIX',type:'SET_PROFILE',payload:profile});
        break;
      case 'CLOSE':lightbox.close();break;
      case 'CONTACT':{
        const email=String(message.payload?.email||profile.email||'').trim();
        if(email)wixLocationFrontend.to(`mailto:${encodeURIComponent(email)}`);
        break;
      }
      default:break;
    }
  });
});
