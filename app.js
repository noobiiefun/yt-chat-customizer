// app.js — YT Chat CSS Customizer logic

// ── STATE ──────────────────────────────────────────────────

const state = {
  currentTheme: 'vtuber',
  currentAnim: 'popIn',
  animSpeed: 400,
  font: 'Nunito',
};

// ── UTILS ──────────────────────────────────────────────────

function setVar(key, value) {
  document.documentElement.style.setProperty(key, value);
}

function getVar(key) {
  return getComputedStyle(document.documentElement).getPropertyValue(key).trim() ||
         document.documentElement.style.getPropertyValue(key).trim();
}

function loadGFont(fontName) {
  if (!fontName || fontName === 'Inter') return;
  const id = 'gf-' + fontName.replace(/\s/g, '-');
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;700&display=swap`;
  document.head.appendChild(link);
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── THEMES ─────────────────────────────────────────────────

function applyTheme(name) {
  const theme = THEMES[name];
  if (!theme) return;

  state.currentTheme = name;
  state.currentAnim = theme.anim;
  state.animSpeed = theme.animSpeed;
  state.font = theme.font;

  // Apply CSS vars
  Object.entries(theme.vars).forEach(([k, v]) => setVar(k, v));

  // Apply font
  loadGFont(theme.font);
  setVar('--chat-font', theme.font);

  // Sync all color inputs
  const colorMap = {
    'c-msg-bg': '--chat-msg-bg',
    'c-border': '--chat-border-color',
    'c-name': '--chat-name-color',
    'c-text': '--chat-text-color',
    'c-badge-bg': '--chat-badge-bg',
    'c-badge-fg': '--chat-badge-color',
    'c-mod': '--chat-mod-name',
    'c-owner': '--chat-owner-name',
    'c-sub': '--chat-sub-name',
  };

  Object.entries(colorMap).forEach(([inputId, cssVar]) => {
    const el = document.getElementById(inputId);
    const val = theme.vars[cssVar];
    if (el && val && /^#[0-9a-fA-F]{6}$/.test(val)) el.value = val;
  });

  // Sync range inputs from theme vars
  const rangeMap = [
    ['rng-rad', '--chat-msg-radius', 'lbl-rad', 'px'],
    ['rng-gap', '--chat-gap', 'lbl-gap', 'px'],
    ['rng-size', '--chat-font-size', 'lbl-size', 'px'],
    ['rng-av', '--chat-avatar-size', 'lbl-av', 'px'],
    ['rng-bw', '--chat-border-width', 'lbl-bw', 'px'],
  ];

  rangeMap.forEach(([rangeId, cssVar, labelId, unit]) => {
    const val = parseInt(theme.vars[cssVar]);
    const rng = document.getElementById(rangeId);
    const lbl = document.getElementById(labelId);
    if (rng && !isNaN(val)) { rng.value = val; }
    if (lbl && !isNaN(val)) { lbl.textContent = val + unit; }
  });

  // Reset padding
  const padV = parseInt(theme.vars['--chat-padding-v']) || 8;
  const rngPad = document.getElementById('rng-pad');
  const lblPad = document.getElementById('lbl-pad');
  if (rngPad) rngPad.value = padV;
  if (lblPad) lblPad.textContent = `${padV}px ${padV * 1.5}px`;

  // Reset opacity
  const opa = Math.round((parseFloat(theme.vars['--chat-bubble-opacity']) || 1) * 100);
  const rngOpa = document.getElementById('rng-opa');
  const lblOpa = document.getElementById('lbl-opa');
  if (rngOpa) rngOpa.value = opa;
  if (lblOpa) lblOpa.textContent = opa + '%';

  // Sync font select
  const selFont = document.getElementById('sel-font');
  if (selFont) selFont.value = theme.font;

  // Sync anim
  setAnimSpeed(theme.animSpeed);
  document.getElementById('rng-aspd').value = theme.animSpeed;
  document.getElementById('lbl-aspd').textContent = theme.animSpeed + 'ms';

  document.querySelectorAll('.anim-btn').forEach(b => b.classList.remove('active'));
  const activeAnim = document.querySelector(`[data-anim="${theme.anim}"]`);
  if (activeAnim) activeAnim.classList.add('active');

  renderPreview();
}

// ── PREVIEW RENDERING ──────────────────────────────────────

function buildMessage(data, delayIndex = 0) {
  const delay = delayIndex * 80;
  const animClass = state.currentAnim === 'none' ? '' : `anim-${state.currentAnim}`;
  const roleClass = data.type === 'mod' ? 'chat-mod' :
                    data.type === 'owner' ? 'chat-owner' :
                    data.type === 'sub' ? 'chat-sub' :
                    data.type === 'verified' ? 'chat-verified' : '';
  const badgeHTML = data.badge ? `<span class="chat-badge">${data.badge}</span>` : '';
  const avatarSize = parseInt(getVar('--chat-avatar-size')) || 32;
  const avatarHTML = avatarSize > 0
    ? `<div class="chat-avatar" style="background:${data.avatarColor}">${data.initials}</div>`
    : '';

  const div = document.createElement('div');
  div.className = `chat-msg ${roleClass} ${animClass}`.trim();
  div.style.animationDelay = delay + 'ms';
  div.style.animationDuration = state.animSpeed + 'ms';
  div.innerHTML = `
    ${avatarHTML}
    <div class="chat-bubble">
      <div class="chat-name">${data.name}${badgeHTML}</div>
      <div class="chat-text">${data.text}</div>
    </div>
  `;
  return div;
}

function renderPreview() {
  const area = document.getElementById('preview-area');
  area.innerHTML = '';
  SAMPLE_MESSAGES.forEach((msg, i) => {
    area.appendChild(buildMessage(msg, i));
  });
  setTimeout(() => { area.scrollTop = area.scrollHeight; }, 600);
}

// ── CSS GENERATION ─────────────────────────────────────────

function generateOBSCss() {
  const font = getVar('--chat-font') || 'Inter';
  const msgBg = getVar('--chat-msg-bg');
  const borderColor = getVar('--chat-border-color');
  const borderWidth = getVar('--chat-border-width') || '3px';
  const nameColor = getVar('--chat-name-color');
  const textColor = getVar('--chat-text-color');
  const fontSize = getVar('--chat-font-size');
  const radius = getVar('--chat-msg-radius');
  const gap = getVar('--chat-gap');
  const badgeBg = getVar('--chat-badge-bg');
  const badgeColor = getVar('--chat-badge-color');
  const opa = getVar('--chat-bubble-opacity') || '1';
  const modColor = getVar('--chat-mod-name');
  const ownerColor = getVar('--chat-owner-name');
  const subColor = getVar('--chat-sub-name');

  const animCss = state.currentAnim === 'none' ? '' : `
yt-live-chat-text-message-renderer,
yt-live-chat-paid-message-renderer,
yt-live-chat-membership-item-renderer {
  animation: ${state.currentAnim} ${state.animSpeed}ms cubic-bezier(.34,1.56,.64,1) both;
}`;

  return `/* =============================================
   YouTube Live Chat Overlay — OBS Browser Source
   Generated by YT Chat CSS Customizer
   ============================================= */

@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;500;700&display=swap');

/* Hapus background bawaan */
body, yt-live-chat-renderer {
  background: transparent !important;
  overflow: hidden !important;
}

yt-live-chat-item-list-renderer {
  background: transparent !important;
}

/* Sembunyikan header & input chat */
yt-live-chat-header-renderer,
yt-live-chat-message-input-renderer {
  display: none !important;
}

/* Bubble pesan utama */
yt-live-chat-text-message-renderer,
yt-live-chat-paid-message-renderer,
yt-live-chat-membership-item-renderer {
  background: ${msgBg} !important;
  border-radius: ${radius} !important;
  border-left: ${borderWidth} solid ${borderColor} !important;
  margin-bottom: ${gap} !important;
  padding: 8px 12px !important;
  opacity: ${opa} !important;
}

/* Nama pengirim */
#author-name.yt-live-chat-text-message-renderer {
  color: ${nameColor} !important;
  font-family: '${font}', sans-serif !important;
  font-size: 11px !important;
  font-weight: 600 !important;
}

/* Isi pesan */
#message.yt-live-chat-text-message-renderer {
  color: ${textColor} !important;
  font-family: '${font}', sans-serif !important;
  font-size: ${fontSize} !important;
  line-height: 1.5 !important;
}

/* Badge (Mod, Member, dll) */
yt-live-chat-author-badge-renderer {
  margin: 0 2px !important;
}

/* Warna nama per role */
yt-live-chat-text-message-renderer[author-type="moderator"] #author-name {
  color: ${modColor} !important;
}

yt-live-chat-text-message-renderer[author-type="owner"] #author-name {
  color: ${ownerColor} !important;
}

yt-live-chat-text-message-renderer[author-type="member"] #author-name {
  color: ${subColor} !important;
}

/* Animasi keyframes */
@keyframes slideIn {
  from { opacity: 0; transform: translateX(-14px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes popIn {
  from { opacity: 0; transform: scale(.88); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes bounceIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
${animCss}
`;
}

function generateSECss() {
  const font = getVar('--chat-font') || 'Inter';
  const msgBg = getVar('--chat-msg-bg');
  const borderColor = getVar('--chat-border-color');
  const borderWidth = getVar('--chat-border-width') || '3px';
  const nameColor = getVar('--chat-name-color');
  const textColor = getVar('--chat-text-color');
  const fontSize = getVar('--chat-font-size');
  const radius = getVar('--chat-msg-radius');
  const gap = getVar('--chat-gap');
  const modColor = getVar('--chat-mod-name');
  const ownerColor = getVar('--chat-owner-name');
  const subColor = getVar('--chat-sub-name');
  const animEntry = state.currentAnim === 'none' ? 'none' :
    `${state.currentAnim} ${state.animSpeed}ms cubic-bezier(.34,1.56,.64,1) both`;

  return `/* =============================================
   YouTube Live Chat — StreamElements CSS
   Generated by YT Chat CSS Customizer
   Paste di: StreamElements > Chat Widget > CSS
   ============================================= */

@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;500;700&display=swap');

* { box-sizing: border-box; }

body {
  background: transparent !important;
  overflow: hidden !important;
}

/* Wrapper tiap baris chat */
.message-row {
  display: flex !important;
  align-items: flex-start !important;
  gap: 8px !important;
  margin-bottom: ${gap} !important;
  animation: ${animEntry} !important;
}

/* Bubble pesan */
.chat-line,
.message {
  background: ${msgBg} !important;
  border-radius: ${radius} !important;
  border-left: ${borderWidth} solid ${borderColor} !important;
  padding: 8px 12px !important;
  flex: 1 !important;
}

/* Nama pengirim */
.username,
span.username {
  font-family: '${font}', sans-serif !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  color: ${nameColor} !important;
}

/* Isi teks pesan */
.message-text,
span.message {
  font-family: '${font}', sans-serif !important;
  font-size: ${fontSize} !important;
  color: ${textColor} !important;
  line-height: 1.5 !important;
  word-break: break-word !important;
}

/* Role moderator */
.username.moderator { color: ${modColor} !important; }

/* Role broadcaster/owner */
.username.broadcaster { color: ${ownerColor} !important; }

/* Role subscriber */
.username.subscriber { color: ${subColor} !important; }

/* Animasi keyframes */
@keyframes slideIn {
  from { opacity: 0; transform: translateX(-14px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes popIn {
  from { opacity: 0; transform: scale(.88); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes bounceIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;
}

// ── EVENT LISTENERS ────────────────────────────────────────

// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// Theme buttons
document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyTheme(btn.dataset.theme);
  });
});

// Anim buttons
document.querySelectorAll('.anim-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.anim-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.currentAnim = btn.dataset.anim;
    renderPreview();
  });
});

// Color inputs
const colorBindings = [
  ['c-msg-bg',   '--chat-msg-bg'],
  ['c-border',   '--chat-border-color'],
  ['c-name',     '--chat-name-color'],
  ['c-text',     '--chat-text-color'],
  ['c-badge-bg', '--chat-badge-bg'],
  ['c-badge-fg', '--chat-badge-color'],
  ['c-mod',      '--chat-mod-name'],
  ['c-owner',    '--chat-owner-name'],
  ['c-sub',      '--chat-sub-name'],
  ['c-verified', '--chat-verified-name'],
];

colorBindings.forEach(([id, cssVar]) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => setVar(cssVar, el.value));
});

// Font select
function setAnimSpeed(ms) {
  state.animSpeed = parseInt(ms);
}

document.getElementById('sel-font').addEventListener('change', function () {
  loadGFont(this.value);
  setVar('--chat-font', this.value);
  state.font = this.value;
});

// Range sliders
const rangeBindings = [
  ['rng-size', '--chat-font-size',  'lbl-size', v => v + 'px'],
  ['rng-rad',  '--chat-msg-radius', 'lbl-rad',  v => v + 'px'],
  ['rng-bw',   '--chat-border-width','lbl-bw',  v => v + 'px'],
  ['rng-av',   '--chat-avatar-size','lbl-av',   v => v + 'px'],
  ['rng-gap',  '--chat-gap',        'lbl-gap',  v => v + 'px'],
];

rangeBindings.forEach(([rangeId, cssVar, labelId, fmt]) => {
  const rng = document.getElementById(rangeId);
  const lbl = document.getElementById(labelId);
  if (!rng) return;
  rng.addEventListener('input', () => {
    setVar(cssVar, fmt(rng.value));
    if (lbl) lbl.textContent = fmt(rng.value);
  });
});

// Padding slider
document.getElementById('rng-pad').addEventListener('input', function () {
  const v = parseInt(this.value);
  setVar('--chat-padding-v', v + 'px');
  setVar('--chat-padding-h', Math.round(v * 1.5) + 'px');
  document.getElementById('lbl-pad').textContent = `${v}px ${Math.round(v * 1.5)}px`;
});

// Opacity slider
document.getElementById('rng-opa').addEventListener('input', function () {
  const v = parseInt(this.value);
  setVar('--chat-bubble-opacity', (v / 100).toFixed(2));
  document.getElementById('lbl-opa').textContent = v + '%';
});

// Anim speed slider
document.getElementById('rng-aspd').addEventListener('input', function () {
  setAnimSpeed(this.value);
  document.getElementById('lbl-aspd').textContent = this.value + 'ms';
});

// Add test message
document.getElementById('btn-add-msg').addEventListener('click', () => {
  const area = document.getElementById('preview-area');
  const msg = EXTRA_MESSAGES[Math.floor(Math.random() * EXTRA_MESSAGES.length)];
  const el = buildMessage({ ...msg, name: msg.name + Math.floor(Math.random() * 99) }, 0);
  area.appendChild(el);
  area.scrollTop = area.scrollHeight;
});

// Copy buttons
document.getElementById('btn-copy-css').addEventListener('click', () => {
  navigator.clipboard.writeText(generateOBSCss())
    .then(() => showToast('✓ CSS disalin! Paste ke OBS Browser Source → Custom CSS'));
});

document.getElementById('btn-copy-se').addEventListener('click', () => {
  navigator.clipboard.writeText(generateSECss())
    .then(() => showToast('✓ CSS disalin! Paste ke StreamElements Chat Widget → CSS'));
});

// ── INIT ───────────────────────────────────────────────────

loadGFont('Nunito');
loadGFont('Poppins');
loadGFont('Inter');
applyTheme('vtuber');
