const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const tick = () => new Promise(resolve => setImmediate(resolve));
const pause = async () => { for(let i=0;i<5;i++) await tick(); };

(async () => {
  const sent = [];
  const opened = [];
  const nodes = new Map();
  let eventHandler;
  const html = {
    postMessage(m) { sent.push(m); },
    onMessage(fn) { eventHandler = fn; }
  };
  nodes.set('#html1', html);
  let nativePhotoProfile = {
    id:'00000000-0000-4000-8000-000000000001',
    firstName:'Test', lastName:'Public', company:'Example', jobTitle:'Analyst',
    email:'test@example.test', visibility:'public', roles:['Mentor'], types:['Traditional']
  };
  const $w = selector => nodes.get(selector);
  $w.onReady = cb => { cb(); };
  const wixData = {
    query(collection) {
      assert.equal(collection,'MentoringIntroVideos');
      let api = {
        eq(k,v) {assert.equal(k,'isActive');assert.equal(v,true);return api;},
        ascending(k) {assert.equal(k,'sortOrder');return api;},
        limit(n) {assert.equal(n,100);return api;},
        async find() {return { items:[{title:'Test video',videoUrl:'https://youtu.be/dQw4w9WgXcQ',isActive:true}] };}
      };return api;
    }
  };
  const backend = {
    async listPublicMentoringMembers(){return [nativePhotoProfile];},
    async getMyMentoringProfile(){return {id:nativePhotoProfile.id,visibility:'private'};},
    async getPublicMemberProfile(id){assert.equal(id,nativePhotoProfile.id);return nativePhotoProfile;},
    async saveMyMentoringProfile(data) {assert.equal(data.firstName,'Test');return {success:true};},
    async saveMentoringFeedback(data) {assert.equal(data.overall,'Fine');return {success:true};}
  };
  const context = {
    $w, wixData, wixWindowFrontend:{async openLightbox(name,args){opened.push({name,args});}},
    ...backend, console:{error(){},warn(){},info(){}},
    setInterval(){return 1;},clearInterval(){},URL,Promise
  };
  const file = path.join(__dirname,'../wix/pages/NP3-Mentoring.js');
  const code = fs.readFileSync(file,'utf8').replace(/^import[\s\S]*?from [^;]+;\n/gm,'');
  vm.runInNewContext(code, context, {filename:file});
  assert.equal(sent[0].type, 'PING');
  eventHandler({data:{source:'NOT_ISC',type:'READY'}});
  assert.equal(sent.length, 1);
  eventHandler({data:{source:'ISC_MENTORING',type:'READY'}});
  await pause();
  assert.deepEqual(sent.filter(m=>m.type==='SET_MEMBERS').map(x=>x.payload.length),[0,1]);
  assert.equal(sent.filter(m=>m.type==='SET_VIDEOS').length,1);
  eventHandler({data:{source:'ISC_MENTORING',type:'PROFILE_SAVE_REQUEST',payload:{firstName:'Test'}}});
  await pause();
  assert.equal(sent.at(-2).type,'SAVE_RESULT');
  eventHandler({data:{source:'ISC_MENTORING',type:'FEEDBACK_SAVE_REQUEST',payload:{overall:'Fine'}}});
  await pause();
  assert.equal(sent.at(-1).type,'SAVE_RESULT');
  eventHandler({data:{source:'ISC_MENTORING',type:'OPEN_PROFILE',payload:{id:nativePhotoProfile.id,firstName:'Forged'}}});
  await pause();
  assert.equal(opened.at(-1).name,'NP5 - Profile Details');
  assert.deepEqual(JSON.parse(JSON.stringify(opened.at(-1).args)),{memberId:nativePhotoProfile.id});
  eventHandler({data:{source:'ISC_MENTORING',type:'OPEN_VIDEO',payload:{title:'Video',videoUrl:'https://youtu.be/dQw4w9WgXcQ'}}});
  await pause();
  assert.equal(opened.at(-1).name,'NP4 - Video Player');
  const before=opened.length;
  eventHandler({data:{source:'ISC_MENTORING',type:'OPEN_VIDEO',payload:{videoUrl:'https://evil.example.test/hello.mp4'}}});
  await pause();
  assert.equal(opened.length,before);
  // NP5: ensure the ID and email are resolved server-side, not from parent iframe.
  let profileMessageHandler;
  const popupMessages=[];
  const redirect=[];
  const popupHtml={postMessage(m){popupMessages.push(m);},onMessage(fn){profileMessageHandler=fn;}};
  const popupW=selector=>{assert.equal(selector,'#html-Profile');return popupHtml;};
  popupW.onReady=cb=>{cb();};
  const popupFile=path.join(__dirname,'../wix/lightboxes/NP5-Profile-Details.js');
  const popupCode=fs.readFileSync(popupFile,'utf8').replace(/^import .*?;$/gm,'');
  vm.runInNewContext(popupCode,{
    $w:popupW,lightbox:{getContext(){return {memberId:nativePhotoProfile.id,profile:{email:'attacker@example.test'}};},close(){}},
    wixLocationFrontend:{to(url){redirect.push(url);}},
    getPublicMemberProfile:backend.getPublicMemberProfile,
    console:{error(){}},Promise
  });
  profileMessageHandler({data:{source:'ISC_PROFILE_HTML',type:'READY'}});
  await pause();
  assert.equal(popupMessages.at(-1).type,'SET_PROFILE');
  assert.equal(popupMessages.at(-1).payload.email,'test@example.test');
  profileMessageHandler({data:{source:'ISC_PROFILE_HTML',type:'CONTACT',payload:{email:'attacker@example.test'}}});
  assert.equal(redirect.length,1);
  assert.ok(redirect[0].includes('test%40example.test'));
  assert.equal(redirect[0].includes('attacker'),false);
  console.log('PASS — 12 bridge protocol/security assertions (LOCAL MOCK; Wix QA pending)');
})().catch(err=>{console.error(err);process.exitCode=1;});
