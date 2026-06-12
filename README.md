# 🎨 YT Chat CSS Customizer

> Tool lokal untuk membuat overlay live chat YouTube yang stylish — cocok untuk OBS, StreamElements, dan browser source lainnya.

![Preview](https://img.shields.io/badge/status-stable-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Platform](https://img.shields.io/badge/platform-OBS%20%7C%20StreamElements-purple)

---

## ✨ Fitur

- **6 preset tema** siap pakai: VTuber Pastel, Neon Cyberpunk, Clean Minimal, Retro Pixel, Ocean Dark, Sakura Pink
- **Kustomisasi penuh** — warna bubble, teks, border, badge, font, ukuran, padding, opacity
- **Warna nama per role** — Moderator, Owner, Subscriber, Verified bisa beda warna
- **4 efek animasi** — Slide, Fade, Pop, Bounce (plus tanpa animasi)
- **Live preview** real-time saat kamu ubah setting
- **Generate CSS** — tombol copy untuk OBS Browser Source dan StreamElements
- Tidak perlu install apapun — buka langsung di browser

---

## 🚀 Cara Pakai

### 1. Jalankan Lokal

```bash
# Clone repo ini
git clone https://github.com/username/yt-chat-customizer.git
cd yt-chat-customizer

# Buka di browser (tidak perlu server)
# Windows: klik dua kali index.html
# Mac/Linux:
open index.html
```

Tidak butuh Node.js, npm, atau server apapun. Cukup buka `index.html` di browser.

---

### 2. Kustomisasi

1. Pilih **preset tema** di tab **Tema**
2. Fine-tune di tab **Warna**, **Style**, dan **Animasi**
3. Preview langsung terlihat di panel kanan
4. Klik **+ Tambah pesan test** untuk preview animasi masuk

---

### 3. Export & Pakai di OBS

1. Klik tombol **Copy CSS (OBS)**
2. Di OBS Studio: tambah **Browser Source**
3. Isi URL dengan link YouTube Live Chat popout:
   ```
   https://www.youtube.com/live_chat?is_popout=1&v=VIDEO_ID_KAMU
   ```
4. Centang **"Custom CSS"**, paste CSS yang sudah disalin
5. Set width ~400px, height ~600px (sesuaikan)

---

### 4. Export & Pakai di StreamElements

1. Klik tombol **Copy CSS (StreamElements)**
2. Di StreamElements: buka **Overlay Editor**
3. Tambah widget **Chat Box** (YouTube)
4. Masuk ke tab **CSS** pada widget settings
5. Paste CSS yang sudah disalin
6. Klik **Save**

---

## 📁 Struktur File

```
yt-chat-customizer/
├── index.html      # Halaman utama app
├── style.css       # CSS app + variabel chat
├── themes.js       # Data preset tema & sample messages
├── app.js          # Logic utama (event, render, generate CSS)
└── README.md       # Dokumentasi ini
```

---

## 🎨 Tema yang Tersedia

| Tema | Font | Vibe |
|------|------|------|
| 🌸 VTuber Pastel | Nunito | Soft purple, kawaii, popIn |
| ⚡ Neon Cyberpunk | JetBrains Mono | Hijau neon di atas hitam |
| ◻ Clean Minimal | Inter | Transparan, tipis, minimalis |
| 👾 Retro Pixel | Press Start 2P | Terminal hijau, 0 radius |
| 🌊 Ocean Dark | Poppins | Biru teal, gelap, tenang |
| 🌺 Sakura Pink | Nunito | Pink hangat, rounded |

---

## 🛠️ Pengembangan

Mau tambah tema sendiri? Edit `themes.js` dan tambahkan objek baru:

```javascript
const THEMES = {
  // ...
  namaTema: {
    name: 'Nama Tampilan',
    vars: {
      '--chat-msg-bg': '#warna',
      '--chat-border-color': '#warna',
      // lihat tema lain untuk referensi lengkap
    },
    font: 'Nama Font',
    anim: 'slideIn', // slideIn | fadeIn | popIn | bounceIn | none
    animSpeed: 350,
  },
};
```

---

## 🤝 Kontribusi

Pull request sangat welcome! Beberapa ide yang bisa dikembangkan:

- [ ] Tambah lebih banyak preset tema
- [ ] Dukungan Twitch chat
- [ ] Export preset ke file JSON (save/load)
- [ ] Mode preview fullscreen
- [ ] Dukungan custom avatar image
- [ ] Integrasi langsung dengan OBS via WebSocket

---

## 📄 Lisensi

MIT License — bebas dipakai, dimodifikasi, dan didistribusikan.

---

<p align="center">Dibuat dengan ❤️ untuk komunitas streamer Indonesia</p>
