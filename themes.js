// themes.js — Preset tema YT Chat CSS Customizer v2

const THEMES = {
  streambox: {
    name: 'Stream Box', vars: {
      '--chat-msg-bg':'#111118','--chat-border-color':'#3b82f6','--chat-border-width':'4px',
      '--chat-name-color':'#ffffff','--chat-text-color':'#d1d5db',
      '--chat-badge-bg':'#3b82f6','--chat-badge-color':'#fff',
      '--chat-msg-radius':'4px','--chat-gap':'8px','--chat-font-size':'13px',
      '--chat-avatar-size':'32px','--chat-padding-v':'8px','--chat-padding-h':'12px','--chat-bubble-opacity':'1',
      '--chat-mod-name':'#ffffff','--chat-mod-border':'#3b82f6',
      '--chat-owner-name':'#ffffff','--chat-owner-border':'#f59e0b',
      '--chat-sub-name':'#ffffff','--chat-sub-border':'#22c55e',
      '--chat-verified-name':'#ffffff','--chat-verified-border':'#a78bfa',
    }, font:'Inter', anim:'slideIn', animSpeed:280,
  },
  vtuber: {
    name: 'VTuber Pastel', vars: {
      '--chat-msg-bg':'#1e1032','--chat-border-color':'#a855f7','--chat-border-width':'3px',
      '--chat-name-color':'#e879f9','--chat-text-color':'#f0e6ff',
      '--chat-badge-bg':'#a855f7','--chat-badge-color':'#fff',
      '--chat-msg-radius':'16px','--chat-gap':'10px','--chat-font-size':'14px',
      '--chat-avatar-size':'32px','--chat-padding-v':'8px','--chat-padding-h':'12px','--chat-bubble-opacity':'1',
      '--chat-mod-name':'#34d399','--chat-mod-border':'#34d399',
      '--chat-owner-name':'#fbbf24','--chat-owner-border':'#fbbf24',
      '--chat-sub-name':'#f472b6','--chat-sub-border':'#f472b6',
      '--chat-verified-name':'#93c5fd','--chat-verified-border':'#93c5fd',
    }, font:'Nunito', anim:'popIn', animSpeed:400,
  },
  neon: {
    name: 'Neon Cyberpunk', vars: {
      '--chat-msg-bg':'#080c10','--chat-border-color':'#00ff88','--chat-border-width':'2px',
      '--chat-name-color':'#00ff88','--chat-text-color':'#b0ffd0',
      '--chat-badge-bg':'#00cc6a','--chat-badge-color':'#001a09',
      '--chat-msg-radius':'4px','--chat-gap':'6px','--chat-font-size':'13px',
      '--chat-avatar-size':'28px','--chat-padding-v':'7px','--chat-padding-h':'10px','--chat-bubble-opacity':'1',
      '--chat-mod-name':'#00e5ff','--chat-mod-border':'#00e5ff',
      '--chat-owner-name':'#ffdd00','--chat-owner-border':'#ffdd00',
      '--chat-sub-name':'#ff69b4','--chat-sub-border':'#ff69b4',
      '--chat-verified-name':'#7fff00','--chat-verified-border':'#7fff00',
    }, font:'JetBrains Mono', anim:'slideIn', animSpeed:250,
  },
  minimal: {
    name: 'Clean Minimal', vars: {
      '--chat-msg-bg':'#ffffff0f','--chat-border-color':'#ffffff25','--chat-border-width':'2px',
      '--chat-name-color':'#ffffff','--chat-text-color':'#cccccc',
      '--chat-badge-bg':'#ffffff18','--chat-badge-color':'#ffffff',
      '--chat-msg-radius':'8px','--chat-gap':'6px','--chat-font-size':'14px',
      '--chat-avatar-size':'0px','--chat-padding-v':'7px','--chat-padding-h':'12px','--chat-bubble-opacity':'1',
      '--chat-mod-name':'#86efac','--chat-mod-border':'#86efac',
      '--chat-owner-name':'#fde68a','--chat-owner-border':'#fde68a',
      '--chat-sub-name':'#f9a8d4','--chat-sub-border':'#f9a8d4',
      '--chat-verified-name':'#93c5fd','--chat-verified-border':'#93c5fd',
    }, font:'Inter', anim:'fadeIn', animSpeed:300,
  },
  retro: {
    name: 'Retro Pixel', vars: {
      '--chat-msg-bg':'#001100','--chat-border-color':'#00ff00','--chat-border-width':'2px',
      '--chat-name-color':'#00ff00','--chat-text-color':'#00dd00',
      '--chat-badge-bg':'#003300','--chat-badge-color':'#00ff00',
      '--chat-msg-radius':'0px','--chat-gap':'4px','--chat-font-size':'11px',
      '--chat-avatar-size':'0px','--chat-padding-v':'6px','--chat-padding-h':'10px','--chat-bubble-opacity':'1',
      '--chat-mod-name':'#ffff00','--chat-mod-border':'#ffff00',
      '--chat-owner-name':'#ff8800','--chat-owner-border':'#ff8800',
      '--chat-sub-name':'#00ffff','--chat-sub-border':'#00ffff',
      '--chat-verified-name':'#ff00ff','--chat-verified-border':'#ff00ff',
    }, font:'Press Start 2P', anim:'fadeIn', animSpeed:150,
  },
  ocean: {
    name: 'Ocean Dark', vars: {
      '--chat-msg-bg':'#0d1b2a','--chat-border-color':'#00b4d8','--chat-border-width':'3px',
      '--chat-name-color':'#48cae4','--chat-text-color':'#caf0f8',
      '--chat-badge-bg':'#0077b6','--chat-badge-color':'#caf0f8',
      '--chat-msg-radius':'12px','--chat-gap':'8px','--chat-font-size':'14px',
      '--chat-avatar-size':'32px','--chat-padding-v':'8px','--chat-padding-h':'12px','--chat-bubble-opacity':'1',
      '--chat-mod-name':'#90e0ef','--chat-mod-border':'#90e0ef',
      '--chat-owner-name':'#ffd166','--chat-owner-border':'#ffd166',
      '--chat-sub-name':'#ff85a1','--chat-sub-border':'#ff85a1',
      '--chat-verified-name':'#a8dadc','--chat-verified-border':'#a8dadc',
    }, font:'Poppins', anim:'bounceIn', animSpeed:350,
  },
  sakura: {
    name: 'Sakura Pink', vars: {
      '--chat-msg-bg':'#2d0a18','--chat-border-color':'#fb7185','--chat-border-width':'3px',
      '--chat-name-color':'#fda4af','--chat-text-color':'#ffe4e6',
      '--chat-badge-bg':'#fb7185','--chat-badge-color':'#fff1f2',
      '--chat-msg-radius':'20px','--chat-gap':'10px','--chat-font-size':'14px',
      '--chat-avatar-size':'32px','--chat-padding-v':'9px','--chat-padding-h':'14px','--chat-bubble-opacity':'1',
      '--chat-mod-name':'#86efac','--chat-mod-border':'#86efac',
      '--chat-owner-name':'#fde68a','--chat-owner-border':'#fde68a',
      '--chat-sub-name':'#f9a8d4','--chat-sub-border':'#f9a8d4',
      '--chat-verified-name':'#c4b5fd','--chat-verified-border':'#c4b5fd',
    }, font:'Nunito', anim:'popIn', animSpeed:400,
  },
};

const SAMPLE_MESSAGES = [
  { type:'normal',   name:'Dek Reza',                       text:'Emote 🐱🎮',                                         badge:null,      avatarColor:'#6366f1', initials:'DR' },
  { type:'sub',      name:'Membership Viewer',               text:'Ini Pesan Dari MemberShip',                          badge:'Member',  avatarColor:'#22c55e', initials:'MV' },
  { type:'normal',   name:'Viewer Biasa',                    text:'Iya',                                                badge:null,      avatarColor:'#64748b', initials:'VB' },
  { type:'owner',    name:'Nama owner yang sangat panjang euy', text:'Reza sukanya oneesan kak 🐱🎮',                   badge:'Owner',   avatarColor:'#f59e0b', initials:'NO' },
  { type:'mod',      name:'Mas Reza',                        text:'Y',                                                  badge:'Mod',     avatarColor:'#3b82f6', initials:'MR' },
  { type:'normal',   name:'GuestViewer99',                   text:'game apa nih? keliatan seru banget wkwk',            badge:null,      avatarColor:'#06b6d4', initials:'GV' },
];

const EXTRA_MESSAGES = [
  { type:'normal', name:'RandomViewer',     text:'pesan test! 🎉',                                   badge:null,      avatarColor:'#14b8a6', initials:'RV' },
  { type:'sub',    name:'NewSubber',        text:'Baru sub nih, kontennya worth it banget!',          badge:'New Sub', avatarColor:'#ec4899', initials:'NS' },
  { type:'mod',    name:'ModHelper',        text:'Reminder: gunakan !commands untuk lihat list cmd',  badge:'Mod',     avatarColor:'#10b981', initials:'MH' },
  { type:'normal', name:'LongMsgViewer',    text:'Kak settingan grafisnya pake resolusi berapa? framenya smooth banget ya 👀', badge:null, avatarColor:'#f59e0b', initials:'LM' },
  { type:'owner',  name:'StreamerSendiri',  text:'Makasih yang udah sub bulan ini! 🙏',               badge:'Owner',   avatarColor:'#f59e0b', initials:'SS' },
];
