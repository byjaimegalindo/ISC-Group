/** LOCAL STUB TESTS ONLY. These do not run in Wix or prove live login/wiring. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const code = fs.readFileSync(path.join(__dirname,'../backend/iscMentoring.web.js'),'utf8')
  .replace(/^import .*;$/gm,'')
  .replace(/^export const /gm,'const ');
let actor = null;
const database = {MentoringProfiles:new Map(), MentoringFeedback:new Map()};
const clone = value => structuredClone(value);
let nextFeedbackId = 0;
let uploadedPhotos = 0;
const wixData = {
  query(collection) {
    const filters=[];
    let pageSize=100, offset=0;
    const q = {
      eq(key,value){ filters.push([key,value]);return q; },
      limit(value){pageSize=value;return q;},
      skip(value){offset=value;return q;},
      async find(options){
        assert.equal(options.suppressAuth,true);
        const matches = [...database[collection].values()].filter(item=>filters.every(([key,value])=>item[key]===value));
        return {items:clone(matches.slice(offset,offset+pageSize)),hasNext(){return offset+pageSize<matches.length;}};
      }
    };
    return q;
  },
  async insert(collection,doc,options){
    assert.equal(options.suppressAuth,true);
    const id=doc._id||`fb-${++nextFeedbackId}`;
    if(database[collection].has(id))throw new Error('duplicate item');
    database[collection].set(id, clone({...doc,_id:id}));
    return clone(database[collection].get(id));
  },
  async save(collection,doc,options){
    assert.equal(options.suppressAuth,true);
    database[collection].set(doc._id,clone(doc));
    return clone(doc);
  },
  async get(collection,id,options){
    assert.equal(options.suppressAuth,true);
    if(!database[collection].has(id))throw new Error('not found');
    return clone(database[collection].get(id));
  }
};
const currentMember={
  async getMember(options){
    assert.deepEqual(options,{fieldsets:['FULL']});
    if(!actor)throw new Error('Member not logged in');
    return actor;
  }
};
const mediaManager={
  async upload(folder,buffer,name,options){
    assert.equal(folder,'/isc-mentoring/profiles');
    assert.ok(buffer.length>0);
    assert.equal(options.metadataOptions.isPrivate,false);
    uploadedPhotos++;
    return {fileUrl:'wix:image://v1/a2b3_mockimg~mv2.jpg/snapshot.jpg#originWidth=50&originHeight=50'};
  }
};
const ids=['00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000002'];
const actorFor = (i) => ({
  _id:ids[i],contactId:ids[i],loginEmail:`tester${i}@example.test`,status:'APPROVED',
  contactDetails:{firstName:i?'Betty':'Alice',lastName:'Example'}
});
const make = new Function('wixData','currentMember','mediaManager','Permissions','webMethod','Buffer',
  `${code}\nreturn {getMyMentoringProfile,saveMyMentoringProfile,listPublicMentoringMembers,getPublicMemberProfile,saveMentoringFeedback};`);
const api=make(wixData,currentMember,mediaManager,{SiteMember:'MEMBER'},(_,fn)=>fn,Buffer);
const samplePayload={
  firstName:'Alice',lastName:'Example',company:'Example Ltd',jobTitle:'CTO',email:'alice@work.test',
  visibility:'public',roles:['Mentor','Mentee'],types:['Traditional'],photoPreview:'',
  mentor:{'CAREER LEVEL':['Senior Leadership'],FUNCTION:['Distribution'],AREA:['Lloyd’s'],bio:'Senior mentor'},
  mentee:{'CAREER LEVEL':['Middle Manage.'],FUNCTION:['Broking'],AREA:['Regulated'],bio:'Learning'}
};
async function rejected(promise){let failed=false;try{await promise;}catch{failed=true;}assert.equal(failed,true);}
(async()=>{
  actor=actorFor(0);
  const a=await api.getMyMentoringProfile();
  assert.equal(a.id,ids[0]);
  assert.equal(a.visibility,'private');
  assert.equal(database.MentoringProfiles.size,1);
  assert.deepEqual(await api.listPublicMentoringMembers(),[]);
  actor=actorFor(1);
  const b=await api.getMyMentoringProfile();
  assert.equal(b.id,ids[1]);
  assert.equal(database.MentoringProfiles.size,2);
  await rejected(api.getPublicMemberProfile(ids[0]));
  actor=actorFor(0);
  await rejected(api.saveMyMentoringProfile({...samplePayload,roles:['Admin']}));
  const saved=await api.saveMyMentoringProfile({...samplePayload,memberId:ids[1],contactId:ids[1]});
  assert.equal(saved.id,ids[0]);
  assert.equal(database.MentoringProfiles.get(ids[0]).memberId,ids[0]);
  assert.equal(database.MentoringProfiles.get(ids[1]).visibility,'private');
  const list=await api.listPublicMentoringMembers();
  assert.equal(list.length,1);
  assert.equal(list[0].id,ids[0]);
  assert.deepEqual(list[0].mentor.careerLevel,['Senior Leadership']);
  actor=actorFor(1);
  assert.equal((await api.getPublicMemberProfile(ids[0])).id,ids[0]);
  assert.equal((await api.saveMentoringFeedback({overall:'Fine',memberId:ids[0]})).success,true);
  assert.equal([...database.MentoringFeedback.values()][0].memberId,ids[1]);
  actor=actorFor(0);
  assert.equal((await api.saveMyMentoringProfile({...samplePayload,visibility:'private'})).visibility,'private');
  assert.deepEqual(await api.listPublicMentoringMembers(),[]);
  actor=actorFor(1);
  await rejected(api.getPublicMemberProfile(ids[0]));
  actor=null;
  await rejected(api.getMyMentoringProfile());
  await rejected(api.listPublicMentoringMembers());
  await rejected(api.saveMyMentoringProfile(samplePayload));
  actor=actorFor(0);
  const pngData=Buffer.from([0x89,0x50,0x4e,0x47,0,0,0]).toString('base64');
  const photoResult=await api.saveMyMentoringProfile({...samplePayload,photoPreview:`data:image/png;base64,${pngData}`});
  assert.equal(photoResult.success,true);
  assert.equal(uploadedPhotos,1);
  assert.equal(database.MentoringProfiles.get(ids[0]).photoUrl,'https://static.wixstatic.com/media/a2b3_mockimg~mv2.jpg');
  await rejected(api.saveMyMentoringProfile({...samplePayload,photoPreview:'data:image/png;base64,AAAAAAAA'}));
  console.log('PASS — 16 SECURITY/CONTRACT CHECKS (LOCAL MOCK: NOT LIVE WIX QA)');
})().catch(e=>{console.error(e);process.exit(1);});
