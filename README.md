# 💩 Poop Clicker Deluxe

Ett beroendeframkallande klickerspel – en fullständig vidareutveckling och uppgradering av den ursprungliga enkla HTML-versionen.

---

## 🌟 Från Vanilla HTML till Deluxe Edition

* **Lösning på 100ms-buggen:** I originalet anropades `innerHTML = ''` var 100:e millisekund, vilket raderade knapparna mitt i klick och ledde till förlorade klick och layout-frysningar. I Deluxe-versionen är alla knappar stabila, reaktiva React-komponenter som uppdateras mjukt i 60 FPS.

---

## ✨ Nya Deluxe-funktioner

* 🔊 **Syntetiserad Web Audio-motor:** 0 externa ljudfiler, noll fördröjning, 3 valbara klickljudsprofiler (*Squelch/Fis*, *Bubbel Pop*, *8-Bit Retro*) samt ljudeffekter för köp, milstolpar, spolningar och autoclicker-larm.
* 🎵 **Loopande temamusik:** Bouncy tecknad klickermelodi i 122 BPM med separat volymreglage och snabbknapp i menyraden.
* 🌟 **Gyllene händelser:** Gyllene bajsen som slumpmässigt svävar förbi med *7x Bajs-rusch* eller direkta bonuspoäng.
* 💤 **AFK / Offline-inkomst:** Beräkning och välkomstskärm som ger dig poäng för tiden du varit borta (upp till 8 timmar).
* 🏆 **Prestationer & Multiplikatorer:** 9 utmaningar med permanenta produktionsbonusar (+1% till +15%).
* 🎨 **Kosmetiska skins:** Upplåsbara utseenden (*Gyllene kung*, *Mjuk toarulle*, *Enhörning*, *Toxisk mutant*).
* 🛒 **Bättre köpkontroller:** `1x`, `10x`, `25x`, `Nästa milstolpe`, `MAX`, samt sortering på ROI och tidsestimat (*"om 14s"*).
* 💾 **Export/Import & Tangentbordsstöd:** Spara och flytta sparfiler mellan enheter, och klicka ergonomiskt med **Mellanslag (Spacebar)**.

---

## 🚀 Teknisk stack

* **Ramverk:** React 19
* **Språk:** TypeScript
* **Styling:** Tailwind CSS v4
* **Ikoner:** Lucide React
* **Ljud:** Native Web Audio API
* **Byggverktyg:** Vite

---

## 💻 Kom igång lokalt

1. **Installera beroenden:**
   ```bash
   npm install
   ```

2. **Starta utvecklingsservern:**
   ```bash
   npm run dev
   ```

3. **Bygg för produktion:**
   ```bash
   npm run build
   ```
