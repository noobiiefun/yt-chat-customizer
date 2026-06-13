// app.js — YT Chat CSS Customizer v2
// Fitur: Role colors, Transparansi penuh, Export/Import preset JSON

// ── STATE ──────────────────────────────────────────────────

const state = {
  currentTheme: 'vtuber',
  currentAnim: 'popIn',
  animSpeed: 400,
  font: 'Nunito',
  transparencyMode: 'normal',
  previewBgIndex: 0,
  roleEnabled: { mod: true, owner: true, sub: true, verified: true },
  savedPresets: [],
};

const PREVIEW_BGS = [
  { cls: 'bg-dark',    label: 'bg: gelap' },
  { cls: 'bg-stream',  label: 'bg: gradient stream' },
  { cls: 'bg-checker', label: 'bg: checker (transparan)' },
  { cls: 'bg-light',   label: 'bg: terang' },
  { cls: 'bg-green',   label: 'bg: green screen' },
];

// ── UTILS ──────────────────────────────────────────────────

function setVar(key, value) {
  document.documentElement.style.setProperty(key, value);
}

function getVar(key) {
  return (
    document.documentElement.style.getPropertyValue(key).trim() ||
    getComputedStyle(document.documentElement).getPropertyValue(key).trim()
  );
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
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── TRANSPARENCY MODE ──────────────────────────────────────

function setTransparencyMode(mode, btn) {
  state.transparencyMode = mode;
  document.querySelectorAll('.trans-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const currentBg = getVar('--chat-msg-bg') || '#1e1032';
  // Parse hex ke rgb
  const hex2rgb = (hex) => {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0,2), 16);
    const g = parseInt(h.substring(2,4), 16);
    const b = parseInt(h.substring(4,6), 16);
    return { r, g, b };
  };

  // Ambil warna solid dari color input
  const solidHex = document.getElementById('c-msg-bg').value || '#1e1032';
  const { r, g, b } = hex2rgb(solidHex);

  if (mode === 'normal') {
    setVar('--chat-msg-bg', solidHex);
    setVar('--chat-bubble-opacity', '1');
    const rngOpa = document.getElementById('rng-opa');
    const lblOpa = document.getElementById('lbl-opa');
    if (rngOpa) rngOpa.value = 100;
    if (lblOpa) lblOpa.textContent = '100%';
  } else if (mode === 'semi') {
    setVar('--chat-msg-bg', `rgba(${r},${g},${b},0.55)`);
    setVar('--chat-bubble-opacity', '1');
    const rngOpa = document.getElementById('rng-opa');
    const lblOpa = document.getElementById('lbl-opa');
    if (rngOpa) rngOpa.value = 55;
    if (lblOpa) lblOpa.textContent = '55%';
  } else if (mode === 'full') {
    setVar('--chat-msg-bg', 'transparent');
    setVar('--chat-bubble-opacity', '1');
    const rngOpa = document.getElementById('rng-opa');
    const lblOpa = document.getElementById('lbl-opa');
    if (rngOpa) rngOpa.value = 0;
    if (lblOpa) lblOpa.textContent = '0%';
  }
}

// ── PREVIEW BACKGROUND ─────────────────────────────────────

function cyclePreviewBg() {
  const area = document.getElementById('preview-area');
  const label = document.getElementById('preview-bg-label');
  // Remove all bg classes
  PREVIEW_BGS.forEach(b => area.classList.remove(b.cls));
  state.previewBgIndex = (state.previewBgIndex + 1) % PREVIEW_BGS.length;
  const next = PREVIEW_BGS[state.previewBgIndex];
  area.classList.add(next.cls);
  label.textContent = next.label;
}

// ── ROLE TOGGLES ──────────────────────────────────────────

function initRoleToggles() {
  ['mod', 'owner', 'sub', 'verified'].forEach(role => {
    const chk = document.getElementById(`chk-role-${role}`);
    const card = document.getElementById(`role-card-${role}`);
    if (!chk) return;
    chk.addEventListener('change', () => {
      state.roleEnabled[role] = chk.checked;
      if (card) card.classList.toggle('disabled', !chk.checked);
      renderPreview();
    });
  });
}

// ── THEMES ─────────────────────────────────────────────────

function applyTheme(name) {
  const theme = THEMES[name];
  if (!theme) return;

  state.currentTheme = name;
  state.currentAnim  = theme.anim;
  state.animSpeed    = theme.animSpeed;
  state.font         = theme.font;

  Object.entries(theme.vars).forEach(([k, v]) => setVar(k, v));

  loadGFont(theme.font);
  setVar('--chat-font', theme.font);

  // Sync color inputs
  const colorMap = {
    'c-msg-bg':       '--chat-msg-bg',
    'c-border':       '--chat-border-color',
    'c-name':         '--chat-name-color',
    'c-text':         '--chat-text-color',
    'c-badge-bg':     '--chat-badge-bg',
    'c-badge-fg':     '--chat-badge-color',
    'c-mod':          '--chat-mod-name',
    'c-mod-border':   '--chat-mod-border',
    'c-owner':        '--chat-owner-name',
    'c-owner-border': '--chat-owner-border',
    'c-sub':          '--chat-sub-name',
    'c-sub-border':   '--chat-sub-border',
    'c-verified':     '--chat-verified-name',
    'c-verified-border': '--chat-verified-border',
  };
  Object.entries(colorMap).forEach(([inputId, cssVar]) => {
    const el = document.getElementById(inputId);
    const val = theme.vars[cssVar];
    if (el && val && /^#[0-9a-fA-F]{6}$/.test(val)) el.value = val;
  });

  // Sync range inputs
  const rangeMap = [
    ['rng-rad',  '--chat-msg-radius',   'lbl-rad',  'px'],
    ['rng-gap',  '--chat-gap',          'lbl-gap',  'px'],
    ['rng-size', '--chat-font-size',    'lbl-size', 'px'],
    ['rng-av',   '--chat-avatar-size',  'lbl-av',   'px'],
    ['rng-bw',   '--chat-border-width', 'lbl-bw',   'px'],
  ];
  rangeMap.forEach(([rid, cssVar, lid, unit]) => {
    const val = parseInt(theme.vars[cssVar]);
    const rng = document.getElementById(rid);
    const lbl = document.getElementById(lid);
    if (rng && !isNaN(val)) rng.value = val;
    if (lbl && !isNaN(val)) lbl.textContent = val + unit;
  });

  // Padding
  const padV = parseInt(theme.vars['--chat-padding-v']) || 8;
  const rngPad = document.getElementById('rng-pad');
  const lblPad = document.getElementById('lbl-pad');
  if (rngPad) rngPad.value = padV;
  if (lblPad) lblPad.textContent = `${padV}px ${Math.round(padV * 1.5)}px`;

  // Opacity
  const opa = Math.round((parseFloat(theme.vars['--chat-bubble-opacity']) || 1) * 100);
  const rngOpa = document.getElementById('rng-opa');
  const lblOpa = document.getElementById('lbl-opa');
  if (rngOpa) rngOpa.value = opa;
  if (lblOpa) lblOpa.textContent = opa + '%';

  // Font select
  const selFont = document.getElementById('sel-font');
  if (selFont) selFont.value = theme.font;

  // Anim
  state.animSpeed = theme.animSpeed;
  const rngAspd = document.getElementById('rng-aspd');
  const lblAspd = document.getElementById('lbl-aspd');
  if (rngAspd) rngAspd.value = theme.animSpeed;
  if (lblAspd) lblAspd.textContent = theme.animSpeed + 'ms';
  document.querySelectorAll('.anim-btn').forEach(b => b.classList.remove('active'));
  const animBtn = document.querySelector(`[data-anim="${theme.anim}"]`);
  if (animBtn) animBtn.classList.add('active');

  // Reset transparency
  state.transparencyMode = 'normal';
  document.querySelectorAll('.trans-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('btn-trans-normal').classList.add('active');

  renderPreview();
}

// ── BUILD & RENDER MESSAGES ────────────────────────────────

function getRoleClass(type) {
  if (type === 'mod')      return state.roleEnabled.mod      ? 'chat-mod'      : 'chat-mod-off';
  if (type === 'owner')    return state.roleEnabled.owner    ? 'chat-owner'    : 'chat-owner-off';
  if (type === 'sub')      return state.roleEnabled.sub      ? 'chat-sub'      : 'chat-sub-off';
  if (type === 'verified') return state.roleEnabled.verified ? 'chat-verified' : '';
  return '';
}

function buildMessage(data, delayIndex = 0) {
  const delay     = delayIndex * 80;
  const animClass = state.currentAnim === 'none' ? '' : `anim-${state.currentAnim}`;
  const roleClass = getRoleClass(data.type);
  const badgeHTML = data.badge ? `<span class="chat-badge">${data.badge}</span>` : '';
  const avSize    = parseInt(getVar('--chat-avatar-size')) || 32;
  const avatarHTML = avSize > 0
    ? `<div class="chat-avatar" style="background:${data.avatarColor}">${data.initials}</div>`
    : '';

  const div = document.createElement('div');
  div.className = `chat-msg ${roleClass} ${animClass}`.replace(/\s+/g, ' ').trim();
  div.style.animationDelay    = delay + 'ms';
  div.style.animationDuration = state.animSpeed + 'ms';
  div.innerHTML = `
    ${avatarHTML}
    <div class="chat-bubble">
      <div class="chat-name">${data.name}${badgeHTML}</div>
      <div class="chat-text">${data.text}</div>
    </div>`;
  return div;
}

function renderPreview() {
  const area = document.getElementById('preview-area');
  area.innerHTML = '';
  SAMPLE_MESSAGES.forEach((msg, i) => area.appendChild(buildMessage(msg, i)));
  setTimeout(() => { area.scrollTop = area.scrollHeight; }, 700);
}

// ── SNAPSHOT CURRENT STATE ─────────────────────────────────

function snapshotState() {
  const cssVarKeys = [
    '--chat-msg-bg','--chat-border-color','--chat-border-width',
    '--chat-name-color','--chat-text-color','--chat-font-size',
    '--chat-msg-radius','--chat-gap','--chat-avatar-size',
    '--chat-padding-v','--chat-padding-h','--chat-bubble-opacity',
    '--chat-badge-bg','--chat-badge-color',
    '--chat-mod-name','--chat-mod-border',
    '--chat-owner-name','--chat-owner-border',
    '--chat-sub-name','--chat-sub-border',
    '--chat-verified-name','--chat-verified-border',
  ];
  const vars = {};
  cssVarKeys.forEach(k => { vars[k] = getVar(k); });
  return {
    font:             state.font,
    anim:             state.currentAnim,
    animSpeed:        state.animSpeed,
    transparencyMode: state.transparencyMode,
    roleEnabled:      { ...state.roleEnabled },
    vars,
  };
}

function applySnapshot(snap) {
  if (!snap || !snap.vars) return;
  Object.entries(snap.vars).forEach(([k, v]) => setVar(k, v));
  loadGFont(snap.font);
  setVar('--chat-font', snap.font);
  state.font             = snap.font;
  state.currentAnim      = snap.anim;
  state.animSpeed        = snap.animSpeed;
  state.transparencyMode = snap.transparencyMode || 'normal';
  if (snap.roleEnabled) Object.assign(state.roleEnabled, snap.roleEnabled);

  // Sync UI controls
  const selFont = document.getElementById('sel-font');
  if (selFont) selFont.value = snap.font;

  const colorMap = {
    'c-msg-bg':'--chat-msg-bg','c-border':'--chat-border-color',
    'c-name':'--chat-name-color','c-text':'--chat-text-color',
    'c-badge-bg':'--chat-badge-bg','c-badge-fg':'--chat-badge-color',
    'c-mod':'--chat-mod-name','c-mod-border':'--chat-mod-border',
    'c-owner':'--chat-owner-name','c-owner-border':'--chat-owner-border',
    'c-sub':'--chat-sub-name','c-sub-border':'--chat-sub-border',
    'c-verified':'--chat-verified-name','c-verified-border':'--chat-verified-border',
  };
  Object.entries(colorMap).forEach(([id, cv]) => {
    const el = document.getElementById(id);
    const val = snap.vars[cv];
    if (el && val && /^#[0-9a-fA-F]{6}$/.test(val)) el.value = val;
  });

  const rangeMap = [
    ['rng-rad','--chat-msg-radius','lbl-rad','px'],
    ['rng-gap','--chat-gap','lbl-gap','px'],
    ['rng-size','--chat-font-size','lbl-size','px'],
    ['rng-av','--chat-avatar-size','lbl-av','px'],
    ['rng-bw','--chat-border-width','lbl-bw','px'],
  ];
  rangeMap.forEach(([rid, cv, lid, unit]) => {
    const val = parseInt(snap.vars[cv]);
    const rng = document.getElementById(rid);
    const lbl = document.getElementById(lid);
    if (rng && !isNaN(val)) rng.value = val;
    if (lbl && !isNaN(val)) lbl.textContent = val + unit;
  });

  const padV = parseInt(snap.vars['--chat-padding-v']) || 8;
  const rngPad = document.getElementById('rng-pad');
  const lblPad = document.getElementById('lbl-pad');
  if (rngPad) rngPad.value = padV;
  if (lblPad) lblPad.textContent = `${padV}px ${Math.round(padV*1.5)}px`;

  const opa = Math.round((parseFloat(snap.vars['--chat-bubble-opacity'])||1)*100);
  const rngOpa = document.getElementById('rng-opa');
  const lblOpa = document.getElementById('lbl-opa');
  if (rngOpa) rngOpa.value = opa;
  if (lblOpa) lblOpa.textContent = opa + '%';

  const rngAspd = document.getElementById('rng-aspd');
  const lblAspd = document.getElementById('lbl-aspd');
  if (rngAspd) rngAspd.value = snap.animSpeed;
  if (lblAspd) lblAspd.textContent = snap.animSpeed + 'ms';

  document.querySelectorAll('.anim-btn').forEach(b => b.classList.remove('active'));
  const animBtn = document.querySelector(`[data-anim="${snap.anim}"]`);
  if (animBtn) animBtn.classList.add('active');

  // Sync role checkboxes
  ['mod','owner','sub','verified'].forEach(role => {
    const chk  = document.getElementById(`chk-role-${role}`);
    const card = document.getElementById(`role-card-${role}`);
    if (chk) chk.checked = state.roleEnabled[role];
    if (card) card.classList.toggle('disabled', !state.roleEnabled[role]);
  });

  // Sync transparency buttons
  document.querySelectorAll('.trans-btn').forEach(b => b.classList.remove('active'));
  const transBtn = document.getElementById(`btn-trans-${state.transparencyMode}`);
  if (transBtn) transBtn.classList.add('active');

  renderPreview();
}

// ── SAVED PRESETS (localStorage) ──────────────────────────

const STORAGE_KEY = 'ytchat_presets_v2';

function loadPresetsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    state.savedPresets = raw ? JSON.parse(raw) : [];
  } catch { state.savedPresets = []; }
}

function savePresetsToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.savedPresets));
}

function renderPresetList() {
  const list  = document.getElementById('saved-presets-list');
  const hint  = document.getElementById('no-presets-hint');
  if (!list) return;
  list.innerHTML = '';

  if (state.savedPresets.length === 0) {
    if (hint) list.appendChild(hint);
    return;
  }

  state.savedPresets.forEach((preset, idx) => {
    const date = new Date(preset.savedAt);
    const dateStr = `${date.getDate()}/${date.getMonth()+1}`;
    const item = document.createElement('div');
    item.className = 'preset-item';
    item.innerHTML = `
      <span class="preset-item-icon">${preset.icon || '🎨'}</span>
      <span class="preset-item-name" title="${preset.name}">${preset.name}</span>
      <span class="preset-item-date">${dateStr}</span>
      <button class="preset-item-del" data-idx="${idx}" title="Hapus preset"><i class="ti ti-trash"></i></button>`;

    item.addEventListener('click', (e) => {
      if (e.target.closest('.preset-item-del')) return;
      applySnapshot(preset.snapshot);
      showToast(`✓ Preset "${preset.name}" dimuat`);
    });
    item.querySelector('.preset-item-del').addEventListener('click', (e) => {
      e.stopPropagation();
      state.savedPresets.splice(idx, 1);
      savePresetsToStorage();
      renderPresetList();
      showToast('Preset dihapus');
    });

    list.appendChild(item);
  });
}

function openSaveModal() {
  document.getElementById('inp-preset-name').value = '';
  document.getElementById('inp-preset-icon').value = '';
  document.getElementById('modal-save').style.display = 'flex';
  setTimeout(() => document.getElementById('inp-preset-name').focus(), 50);
}

function closeModal() {
  document.getElementById('modal-save').style.display = 'none';
}

function confirmSavePreset() {
  const name = document.getElementById('inp-preset-name').value.trim();
  const icon = document.getElementById('inp-preset-icon').value.trim() || '🎨';
  if (!name) { showToast('⚠ Masukkan nama preset dulu'); return; }

  const preset = {
    name,
    icon,
    savedAt: Date.now(),
    snapshot: snapshotState(),
  };
  state.savedPresets.unshift(preset);
  if (state.savedPresets.length > 20) state.savedPresets.pop(); // max 20
  savePresetsToStorage();
  renderPresetList();
  closeModal();
  showToast(`✓ Preset "${name}" tersimpan!`);
}

// ── EXPORT / IMPORT JSON ───────────────────────────────────

function exportPresets() {
  const snap = snapshotState();
  const exportData = {
    _type: 'ytchat-customizer-export',
    _version: 2,
    exportedAt: new Date().toISOString(),
    currentSnapshot: snap,
    savedPresets: state.savedPresets,
  };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `ytchat-preset-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('✓ File JSON berhasil diexport!');
}

function importPresets(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data._type !== 'ytchat-customizer-export') throw new Error('Format tidak valid');

      // Import saved presets (merge, no duplicate by name)
      if (Array.isArray(data.savedPresets)) {
        data.savedPresets.forEach(p => {
          const exists = state.savedPresets.find(s => s.name === p.name);
          if (!exists) state.savedPresets.unshift(p);
        });
        if (state.savedPresets.length > 20) state.savedPresets = state.savedPresets.slice(0, 20);
        savePresetsToStorage();
        renderPresetList();
      }

      // Apply current snapshot dari file
      if (data.currentSnapshot) applySnapshot(data.currentSnapshot);

      showToast(`✓ Import berhasil! ${data.savedPresets?.length || 0} preset dimuat`);
    } catch (err) {
      showToast('⚠ File tidak valid atau rusak');
    }
  };
  reader.readAsText(file);
}

// ── CSS GENERATION ─────────────────────────────────────────

function generateOBSCss() {
  const font        = getVar('--chat-font') || 'Inter';
  const msgBg       = state.transparencyMode === 'full' ? 'transparent' : getVar('--chat-msg-bg');
  const borderColor = getVar('--chat-border-color');
  const borderWidth = getVar('--chat-border-width') || '3px';
  const nameColor   = getVar('--chat-name-color');
  const textColor   = getVar('--chat-text-color');
  const fontSize    = getVar('--chat-font-size');
  const radius      = getVar('--chat-msg-radius');
  const gap         = getVar('--chat-gap');
  const opa         = state.transparencyMode === 'full' ? '0' : (getVar('--chat-bubble-opacity') || '1');
  const modColor    = state.roleEnabled.mod      ? getVar('--chat-mod-name')        : nameColor;
  const modBorder   = state.roleEnabled.mod      ? getVar('--chat-mod-border')      : borderColor;
  const ownerColor  = state.roleEnabled.owner    ? getVar('--chat-owner-name')      : nameColor;
  const ownerBorder = state.roleEnabled.owner    ? getVar('--chat-owner-border')    : borderColor;
  const subColor    = state.roleEnabled.sub      ? getVar('--chat-sub-name')        : nameColor;
  const subBorder   = state.roleEnabled.sub      ? getVar('--chat-sub-border')      : borderColor;
  const verColor    = state.roleEnabled.verified ? getVar('--chat-verified-name')   : nameColor;
  const verBorder   = state.roleEnabled.verified ? getVar('--chat-verified-border') : borderColor;

  const animCss = state.currentAnim === 'none' ? '' : `
yt-live-chat-text-message-renderer,
yt-live-chat-paid-message-renderer,
yt-live-chat-membership-item-renderer {
  animation: ${state.currentAnim} ${state.animSpeed}ms cubic-bezier(.34,1.56,.64,1) both !important;
}`;

  const transNote = state.transparencyMode === 'full'
    ? '/* Mode: TRANSPARAN PENUH — hanya teks & border terlihat */'
    : state.transparencyMode === 'semi'
    ? '/* Mode: SEMI TRANSPARAN */'
    : '/* Mode: NORMAL */';

  return `/* =============================================
   YouTube Live Chat Overlay — OBS Browser Source
   Generated by YT Chat CSS Customizer v2
   ============================================= */

${transNote}

@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;500;700&display=swap');

body, yt-live-chat-renderer {
  background: transparent !important;
  overflow: hidden !important;
}

yt-live-chat-item-list-renderer {
  background: transparent !important;
}

yt-live-chat-header-renderer,
yt-live-chat-message-input-renderer {
  display: none !important;
}

yt-live-chat-text-message-renderer,
yt-live-chat-paid-message-renderer,
yt-live-chat-membership-item-renderer {
  background: ${msgBg} !important;
  border-radius: ${radius} !important;
  border-left: ${borderWidth} solid ${borderColor} !important;
  margin-bottom: ${gap} !important;
  padding: 8px 12px !important;
  opacity: ${opa === '0' ? '1' : opa} !important;
  backdrop-filter: blur(0px);
}

#author-name.yt-live-chat-text-message-renderer {
  color: ${nameColor} !important;
  font-family: '${font}', sans-serif !important;
  font-size: 11px !important;
  font-weight: 600 !important;
}

#message.yt-live-chat-text-message-renderer {
  color: ${textColor} !important;
  font-family: '${font}', sans-serif !important;
  font-size: ${fontSize} !important;
  line-height: 1.5 !important;
}

/* ── Warna nama & border per role ── */
yt-live-chat-text-message-renderer[author-type="moderator"] {
  border-left-color: ${modBorder} !important;
}
yt-live-chat-text-message-renderer[author-type="moderator"] #author-name {
  color: ${modColor} !important;
}

yt-live-chat-text-message-renderer[author-type="owner"] {
  border-left-color: ${ownerBorder} !important;
}
yt-live-chat-text-message-renderer[author-type="owner"] #author-name {
  color: ${ownerColor} !important;
}

yt-live-chat-text-message-renderer[author-type="member"] {
  border-left-color: ${subBorder} !important;
}
yt-live-chat-text-message-renderer[author-type="member"] #author-name {
  color: ${subColor} !important;
}

yt-live-chat-text-message-renderer[author-type="verified"] #author-name {
  color: ${verColor} !important;
}

/* ── Keyframes ── */
@keyframes slideIn  { from { opacity:0; transform:translateX(-14px); } to { opacity:1; transform:translateX(0); } }
@keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
@keyframes popIn    { from { opacity:0; transform:scale(.88); } to { opacity:1; transform:scale(1); } }
@keyframes bounceIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
${animCss}
`;
}

function generateSECss() {
  const font        = getVar('--chat-font') || 'Inter';
  const msgBg       = state.transparencyMode === 'full' ? 'transparent' : getVar('--chat-msg-bg');
  const borderColor = getVar('--chat-border-color');
  const borderWidth = getVar('--chat-border-width') || '3px';
  const nameColor   = getVar('--chat-name-color');
  const textColor   = getVar('--chat-text-color');
  const fontSize    = getVar('--chat-font-size');
  const radius      = getVar('--chat-msg-radius');
  const gap         = getVar('--chat-gap');
  const modColor    = state.roleEnabled.mod      ? getVar('--chat-mod-name')      : nameColor;
  const ownerColor  = state.roleEnabled.owner    ? getVar('--chat-owner-name')    : nameColor;
  const subColor    = state.roleEnabled.sub      ? getVar('--chat-sub-name')      : nameColor;
  const animEntry   = state.currentAnim === 'none' ? 'none'
    : `${state.currentAnim} ${state.animSpeed}ms cubic-bezier(.34,1.56,.64,1) both`;

  return `/* =============================================
   YouTube Live Chat — StreamElements CSS
   Generated by YT Chat CSS Customizer v2
   Paste di: Chat Widget → CSS
   ============================================= */

@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;500;700&display=swap');

* { box-sizing: border-box; }
body { background: transparent !important; overflow: hidden !important; }

.message-row {
  display: flex !important;
  align-items: flex-start !important;
  gap: 8px !important;
  margin-bottom: ${gap} !important;
  animation: ${animEntry} !important;
}

.chat-line, .message {
  background: ${msgBg} !important;
  border-radius: ${radius} !important;
  border-left: ${borderWidth} solid ${borderColor} !important;
  padding: 8px 12px !important;
  flex: 1 !important;
}

.username, span.username {
  font-family: '${font}', sans-serif !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  color: ${nameColor} !important;
}

.message-text, span.message {
  font-family: '${font}', sans-serif !important;
  font-size: ${fontSize} !important;
  color: ${textColor} !important;
  line-height: 1.5 !important;
  word-break: break-word !important;
}

/* Role colors */
.username.moderator   { color: ${modColor}   !important; }
.username.broadcaster { color: ${ownerColor} !important; }
.username.subscriber  { color: ${subColor}   !important; }

@keyframes slideIn  { from { opacity:0; transform:translateX(-14px); } to { opacity:1; transform:translateX(0); } }
@keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
@keyframes popIn    { from { opacity:0; transform:scale(.88); } to { opacity:1; transform:scale(1); } }
@keyframes bounceIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
`;
}

// ── EVENT LISTENERS ────────────────────────────────────────

// Tabs
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
  ['c-msg-bg','--chat-msg-bg'],
  ['c-border','--chat-border-color'],
  ['c-name','--chat-name-color'],
  ['c-text','--chat-text-color'],
  ['c-badge-bg','--chat-badge-bg'],
  ['c-badge-fg','--chat-badge-color'],
  ['c-mod','--chat-mod-name'],
  ['c-mod-border','--chat-mod-border'],
  ['c-owner','--chat-owner-name'],
  ['c-owner-border','--chat-owner-border'],
  ['c-sub','--chat-sub-name'],
  ['c-sub-border','--chat-sub-border'],
  ['c-verified','--chat-verified-name'],
  ['c-verified-border','--chat-verified-border'],
];
colorBindings.forEach(([id, cssVar]) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => {
    setVar(cssVar, el.value);
    // Jika ubah msg-bg, update dot di role-card sesuai
    renderPreview();
  });
});

// Font
document.getElementById('sel-font').addEventListener('change', function () {
  loadGFont(this.value);
  setVar('--chat-font', this.value);
  state.font = this.value;
});

// Range sliders
[
  ['rng-size','--chat-font-size','lbl-size', v => v+'px'],
  ['rng-rad','--chat-msg-radius','lbl-rad',  v => v+'px'],
  ['rng-bw','--chat-border-width','lbl-bw',  v => v+'px'],
  ['rng-av','--chat-avatar-size','lbl-av',   v => v+'px'],
  ['rng-gap','--chat-gap','lbl-gap',         v => v+'px'],
].forEach(([rid, cssVar, lid, fmt]) => {
  const rng = document.getElementById(rid);
  const lbl = document.getElementById(lid);
  if (!rng) return;
  rng.addEventListener('input', () => {
    setVar(cssVar, fmt(rng.value));
    if (lbl) lbl.textContent = fmt(rng.value);
  });
});

document.getElementById('rng-pad').addEventListener('input', function () {
  const v = parseInt(this.value);
  setVar('--chat-padding-v', v+'px');
  setVar('--chat-padding-h', Math.round(v*1.5)+'px');
  document.getElementById('lbl-pad').textContent = `${v}px ${Math.round(v*1.5)}px`;
});

document.getElementById('rng-opa').addEventListener('input', function () {
  const v = parseInt(this.value);
  setVar('--chat-bubble-opacity', (v/100).toFixed(2));
  document.getElementById('lbl-opa').textContent = v+'%';
});

document.getElementById('rng-aspd').addEventListener('input', function () {
  state.animSpeed = parseInt(this.value);
  document.getElementById('lbl-aspd').textContent = this.value+'ms';
});

// Add test msg
document.getElementById('btn-add-msg').addEventListener('click', () => {
  const area = document.getElementById('preview-area');
  const msg  = EXTRA_MESSAGES[Math.floor(Math.random() * EXTRA_MESSAGES.length)];
  const el   = buildMessage({ ...msg, name: msg.name + Math.floor(Math.random()*99) }, 0);
  area.appendChild(el);
  area.scrollTop = area.scrollHeight;
});

// Copy CSS
document.getElementById('btn-copy-css').addEventListener('click', () => {
  navigator.clipboard.writeText(generateOBSCss())
    .then(() => showToast('✓ CSS disalin! Paste ke OBS Browser Source → Custom CSS'));
});
document.getElementById('btn-copy-se').addEventListener('click', () => {
  navigator.clipboard.writeText(generateSECss())
    .then(() => showToast('✓ CSS disalin! Paste ke StreamElements Chat Widget → CSS'));
});

// Preview bg toggle
document.getElementById('btn-toggle-bg').addEventListener('click', cyclePreviewBg);

// Save preset
document.getElementById('btn-save-preset').addEventListener('click', openSaveModal);

// Modal keyboard
document.getElementById('inp-preset-name').addEventListener('keydown', e => {
  if (e.key === 'Enter') confirmSavePreset();
  if (e.key === 'Escape') closeModal();
});
document.getElementById('modal-save').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

// Export
document.getElementById('btn-export-preset').addEventListener('click', exportPresets);

// Import
document.getElementById('inp-import').addEventListener('change', function () {
  if (this.files[0]) { importPresets(this.files[0]); this.value = ''; }
});

// ── INIT ──────────────────────────────────────────────────

loadGFont('Nunito');
loadGFont('Poppins');
loadGFont('Inter');
loadPresetsFromStorage();
renderPresetList();
initRoleToggles();

// Set initial preview bg
document.getElementById('preview-area').classList.add('bg-dark');

applyTheme('vtuber');
