/**
 * ISC Group Mentor / Mentee — Backend Velo (Wix Editor)
 * Site: c2be21cd-0fb0-4709-bf5c-b68ef3e7633a (development, UNPUBLISHED)
 * CMS: MentoringProfiles, MentoringFeedback (ADMIN only)
 * Source of truth for identity: currentMember.getMember() on SERVER.
 * DO NOT call these functions directly from an iframe; Wix page code is the bridge.
 */
import wixData from 'wix-data';
import { currentMember } from 'wix-members-backend';
import { mediaManager } from 'wix-media-backend';
import { Permissions, webMethod } from 'wix-web-module';

const PROFILES = 'MentoringProfiles';
const FEEDBACK = 'MentoringFeedback';
const ADMIN_OPTIONS = { suppressAuth: true };
const ROLES = ['Mentor', 'Mentee'];
const TYPES = ['Traditional', 'Reverse', 'Peer-to-Peer'];
const CAREER_LEVEL = ['Early Career', 'Middle Manage.', 'Senior Leadership', 'C-suite', 'Board Exec.'];
const FUNCTIONS = ['Marketing', 'Sales', 'Distribution', 'Broking', 'Underwriting', 'Risk'];
const AREAS = ['Lloyd’s', 'London Market', 'General Insurance', 'Regulated', 'Unregulated'];

function str(value, max = 200) {
  return String(value === undefined || value === null ? '' : value).trim().slice(0, max);
}

function optionalText(value, label, max) {
  const result = String(value === undefined || value === null ? '' : value).trim();
  if (result.length > max) throw new Error(`${label}: maximum ${max} characters`);
  return result;
}

function requireText(value, label, max) {
  const result = optionalText(value, label, max);
  if (!result) throw new Error(`${label}: required`);
  return result;
}

function list(value, allowed) {
  if (!Array.isArray(value) || value.length > allowed.length) throw new Error('Invalid selection list');
  if (value.some(v => typeof v !== 'string' || !allowed.includes(v))) throw new Error('Invalid selection option');
  return [...new Set(value)];
}

function matrix(value = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Invalid preferences');
  }
  return {
    careerLevel: list(value['CAREER LEVEL'] || value.careerLevel || [], CAREER_LEVEL),
    function: list(value.FUNCTION || value.function || [], FUNCTIONS),
    area: list(value.AREA || value.area || [], AREAS),
    bio: optionalText(value.bio, 'Biography', 300)
  };
}

function normalizeImageUrl(value) {
  const url = str(value, 2000);
  if (/^https:\/\//i.test(url)) return url;
  if (/^\/\//.test(url)) return `https:${url}`;
  // Wix Media references are not accepted by the frozen NP5 iframe.
  // Extract only a media file identifier; never accept arbitrary URLs or HTML.
  const match = /^wix:image:\/\/v1\/([a-zA-Z0-9_~.\-]+)\//.exec(url);
  return match ? `https://static.wixstatic.com/media/${match[1]}` : '';
}

function fromNative(m) {
  const firstName = str(m.contactDetails?.firstName || m.contact?.firstName, 100);
  const lastName = str(m.contactDetails?.lastName || m.contact?.lastName, 100);
  return {
    _id: m._id,
    memberId: m._id,
    contactId: str(m.contactId, 100),
    firstName,
    lastName,
    company: str(m.contactDetails?.company || m.contact?.company, 150),
    jobTitle: str(m.contactDetails?.jobTitle || m.contact?.jobTitle, 150),
    email: str(m.loginEmail, 254),
    photoUrl: normalizeImageUrl(m.profile?.profilePhoto?.url || m.profile?.photo?.url),
    visibility: 'private',
    isActive: false,
    profileCompleted: false,
    memberStatus: str(m.status, 40),
    roles: [],
    types: [],
    mentorCareerLevel: [],
    mentorFunction: [],
    mentorArea: [],
    mentorBio: '',
    menteeCareerLevel: [],
    menteeFunction: [],
    menteeArea: [],
    menteeBio: '',
    source: 'wix_members_live_bootstrap'
  };
}

async function getLoggedInMember() {
  const m = await currentMember.getMember({ fieldsets: ['FULL'] });
  if (!m || !/^[a-f0-9-]{36}$/i.test(String(m._id || ''))) {
    throw new Error('Please log in to Wix Members.');
  }
  if (m.status && m.status !== 'APPROVED' && m.status !== 'UNKNOWN') {
    throw new Error('This account is not approved.');
  }
  return m;
}

async function getOrCreateProfile(m) {
  const lookup = await wixData.query(PROFILES)
    .eq('_id', m._id)
    .limit(1)
    .find(ADMIN_OPTIONS);
  const existing = lookup.items?.[0];
  if (existing) return existing;
  try {
    return await wixData.insert(PROFILES, fromNative(m), ADMIN_OPTIONS);
  } catch (error) {
    // Two simultaneous first-login calls can race; never mint a second ID.
    const raced = await wixData.query(PROFILES)
      .eq('_id', m._id)
      .limit(1)
      .find(ADMIN_OPTIONS);
    if (raced.items?.[0]) return raced.items[0];
    throw error;
  }
}

function asPayload(item) {
  return {
    id: item._id,
    firstName: str(item.firstName, 100),
    lastName: str(item.lastName, 100),
    company: str(item.company, 150),
    jobTitle: str(item.jobTitle, 150),
    email: str(item.email, 254),
    visibility: item.visibility === 'public' ? 'public' : 'private',
    photo: normalizeImageUrl(item.photoUrl),
    initial: str(item.firstName, 1).toUpperCase() || '?',
    roles: Array.isArray(item.roles) ? item.roles.filter(v => ROLES.includes(v)) : [],
    types: Array.isArray(item.types) ? item.types.filter(v => TYPES.includes(v)) : [],
    mentor: {
      careerLevel: Array.isArray(item.mentorCareerLevel) ? item.mentorCareerLevel : [],
      function: Array.isArray(item.mentorFunction) ? item.mentorFunction : [],
      area: Array.isArray(item.mentorArea) ? item.mentorArea : [],
      bio: str(item.mentorBio, 300)
    },
    mentee: {
      careerLevel: Array.isArray(item.menteeCareerLevel) ? item.menteeCareerLevel : [],
      function: Array.isArray(item.menteeFunction) ? item.menteeFunction : [],
      area: Array.isArray(item.menteeArea) ? item.menteeArea : [],
      bio: str(item.menteeBio, 300)
    }
  };
}

async function saveImagePreview(dataUrl, memberId) {
  if (!dataUrl) return null;
  if (typeof dataUrl !== 'string' || dataUrl.length > 7_200_000) throw new Error('Photo exceeds 5 MB');
  const match = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!match) throw new Error('Photo must be JPEG, PNG or WEBP');
  const mime = match[1] === 'jpeg' ? 'image/jpeg' : `image/${match[1]}`;
  const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
  const buffer = Buffer.from(match[2], 'base64');
  if (!buffer.length || buffer.length > 5_000_000) throw new Error('Photo exceeds 5 MB');
  const bytes = buffer;
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = bytes[0] === 0x89 && bytes.subarray(1, 4).toString('ascii') === 'PNG';
  const webp = bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP';
  if ((ext === 'jpg' && !jpeg) || (ext === 'png' && !png) || (ext === 'webp' && !webp)) {
    throw new Error('File contents do not match photo type');
  }
  const uploaded = await mediaManager.upload(
    '/isc-mentoring/profiles',
    buffer,
    `${memberId}-${Date.now()}.${ext}`,
    {
      mediaOptions: { mimeType: mime, mediaType: 'image' },
      metadataOptions: { isPrivate: false, isVisitorUpload: false }
    }
  );
  const url = normalizeImageUrl(uploaded.fileUrl);
  if (!url) throw new Error('Photo uploaded but no usable HTTPS media URL was returned');
  return url;
}

function validateSave(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Invalid profile payload');
  }
  const firstName = requireText(payload.firstName, 'First Name', 100);
  const lastName = requireText(payload.lastName, 'Last Name', 100);
  const company = requireText(payload.company, 'Company', 150);
  const jobTitle = requireText(payload.jobTitle, 'Job Title', 150);
  const email = requireText(payload.email, 'Email', 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid contact email');
  const visibility = payload.visibility === 'public' ? 'public' :
    payload.visibility === 'private' ? 'private' : null;
  if (!visibility) throw new Error('Invalid visibility');
  const roles = list(payload.roles || [], ROLES);
  const types = list(payload.types || [], TYPES);
  if (!roles.length) throw new Error('Select Mentor, Mentee, or both');
  const mentor = matrix(payload.mentor || {});
  const mentee = matrix(payload.mentee || {});
  return {
    firstName,
    lastName,
    company,
    jobTitle,
    email,
    visibility,
    roles,
    types,
    mentorCareerLevel: mentor.careerLevel,
    mentorFunction: mentor.function,
    mentorArea: mentor.area,
    mentorBio: mentor.bio,
    menteeCareerLevel: mentee.careerLevel,
    menteeFunction: mentee.function,
    menteeArea: mentee.area,
    menteeBio: mentee.bio,
    profileCompleted: true,
    isActive: visibility === 'public'
  };
}

/** For native Wix login: returns only YOUR own private profile. */
export const getMyMentoringProfile = webMethod(Permissions.SiteMember, async () => {
  const m = await getLoggedInMember();
  const profile = await getOrCreateProfile(m);
  const hydrated = asPayload(profile);
  // Keep the source account's first available fields without overwriting edits.
  return {
    ...hydrated,
    firstName: hydrated.firstName || str(m.contactDetails?.firstName, 100),
    lastName: hydrated.lastName || str(m.contactDetails?.lastName, 100),
    company: hydrated.company || str(m.contactDetails?.company, 150),
    jobTitle: hydrated.jobTitle || str(m.contactDetails?.jobTitle, 150),
    email: hydrated.email || str(m.loginEmail, 254),
    photo: hydrated.photo || normalizeImageUrl(m.profile?.profilePhoto?.url)
  };
});

export const saveMyMentoringProfile = webMethod(Permissions.SiteMember, async (payload) => {
  const m = await getLoggedInMember();
  const validated = validateSave(payload);
  const previous = await getOrCreateProfile(m);
  let photoUrl = previous.photoUrl || normalizeImageUrl(m.profile?.profilePhoto?.url) || '';
  if (payload.photoPreview) {
    photoUrl = await saveImagePreview(payload.photoPreview, m._id);
  }
  const saved = await wixData.save(PROFILES, {
    ...previous,
    ...validated,
    _id: m._id,
    memberId: m._id,
    contactId: str(m.contactId, 100),
    memberStatus: str(m.status, 40),
    photoUrl,
    source: 'isc_mentoring_profile_save',
    lastSyncedAt: new Date()
  }, ADMIN_OPTIONS);
  return { success: true, id: saved._id, visibility: saved.visibility };
});

/** Returns ONLY explicitly published mentoring profiles; no Wix Contacts access. */
export const listPublicMentoringMembers = webMethod(Permissions.SiteMember, async () => {
  await getLoggedInMember();
  const members = [];
  let skip = 0;
  const pageSize = 100;
  // Upper bound protects the web method; implement server pagination after 1,000 profiles.
  while (skip < 1000) {
    const response = await wixData.query(PROFILES)
      .eq('visibility', 'public')
      .eq('isActive', true)
      .eq('profileCompleted', true)
      .limit(pageSize)
      .skip(skip)
      .find(ADMIN_OPTIONS);
    for (const p of response.items || []) {
      if (p.memberId === p._id && p.roles?.length && p.memberStatus !== 'BLOCKED') {
        members.push(asPayload(p));
      }
    }
    if (!response.hasNext()) break;
    skip += pageSize;
  }
  return members;
});

/** Ignores any caller-provided personal information; uses only the member GUID. */
export const getPublicMemberProfile = webMethod(Permissions.SiteMember, async (memberId) => {
  const current = await getLoggedInMember();
  if (!/^[a-f0-9-]{36}$/i.test(String(memberId || ''))) throw new Error('Invalid member ID');
  const p = await wixData.get(PROFILES, memberId, ADMIN_OPTIONS).catch(() => null);
  if (!p || p.memberId !== p._id) throw new Error('Profile not found');
  if (current._id !== memberId && !(p.visibility === 'public' && p.isActive && p.profileCompleted)) {
    throw new Error('Profile is private');
  }
  return asPayload(p);
});

export const saveMentoringFeedback = webMethod(Permissions.SiteMember, async (payload) => {
  const m = await getLoggedInMember();
  if (!payload || typeof payload !== 'object') throw new Error('Invalid feedback');
  const overall = optionalText(payload.overall, 'Overall feedback', 2000);
  const positive = optionalText(payload.positive, 'Positive feedback', 2000);
  const improvements = optionalText(payload.improvements, 'Improvements feedback', 2000);
  if (!overall && !positive && !improvements) throw new Error('Provide feedback before saving');
  const saved = await wixData.insert(FEEDBACK, {
    memberId: m._id,
    overall,
    positive,
    improvements,
    status: 'new'
  }, ADMIN_OPTIONS);
  return { success: true, id: saved._id };
});
