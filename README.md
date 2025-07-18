# 🎹 Lofi Piano Experience

An immersive, interactive piano experience with a cozy lofi aesthetic. Features a fullscreen video background, beautiful SVG piano interface, and rich audio powered by Tone.js.

![Lofi Piano Experience](https://img.shields.io/badge/Status-Ready%20to%20Play-brightgreen)
![Technologies](https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JavaScript%20%7C%20Tone.js-blue)

## ✨ Features

- **Fullscreen Lofi Video Background** - Immersive looping video creates the perfect ambiance
- **Interactive SVG Piano** - Beautiful, responsive piano interface with 18 white keys, 12 black keys, and 7 drum pads
- **Rich Audio Experience** - Powered by Tone.js with:
  - Warm piano sounds with reverb and compression
  - 7 different drum sounds (kick, snare, hi-hat, open hat, clap, crash, tom)
  - Polyphonic piano synthesis with lofi character
- **Dual Input Methods** - Play with mouse/touch or keyboard
- **Visual Feedback** - Keys glow and animate when pressed
- **Responsive Design** - Works on different screen sizes
- **Cozy Aesthetic** - Soft glows, atmospheric effects, and lofi styling

## 🎮 How to Play

### Keyboard Controls

#### 🥁 Drum Pads (Numbers 1-7)
- `1` - Kick Drum
- `2` - Snare
- `3` - Hi-Hat
- `4` - Open Hat
- `5` - Clap
- `6` - Crash
- `7` - Tom

#### ⚫ Black Keys (QWERTY Row)
- `Q` - C#3
- `W` - D#3
- `E` - F#3
- `R` - G#3
- `T` - A#3
- `Y` - C#4
- `U` - D#4
- `I` - F#4
- `O` - G#4
- `P` - A#4
- `[` - C#5
- `]` - D#5

#### ⚪ White Keys (ASDF Row)
- `A` - C3
- `S` - D3
- `D` - E3
- `F` - F3
- `G` - G3
- `H` - A3
- `J` - B3
- `K` - C4
- `L` - D4
- `;` - E4
- `'` - F4
- `Enter` - G4

#### ⚪ Additional White Keys (ZXCV Row)
- `Z` - A4
- `X` - B4
- `C` - C5
- `V` - D5
- `B` - E5
- `N` - F5

### Mouse/Touch Controls
- **Click** any key or pad to play
- **Click and hold** for sustained notes
- **Click the video** to pause/play background

## 🚀 Getting Started

1. **Open the project** - Simply open `index.html` in a modern web browser
2. **Allow audio** - Click anywhere or press any key to enable audio (browser requirement)
3. **Start playing** - Use keyboard or mouse to play the piano!

## 📁 Project Structure

```
Lofi/
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── script.js           # Interactive functionality and audio
├── piano.svg           # Interactive piano SVG
├── Lofi Background.mov # Background video
└── README.md           # This documentation
```

## 🛠️ Technical Details

### Technologies Used
- **HTML5** - Semantic structure and video element
- **CSS3** - Modern styling with animations, backdrop filters, and responsive design
- **JavaScript (ES6+)** - Interactive functionality and event handling
- **Tone.js** - Web Audio API wrapper for rich sound synthesis
- **SVG** - Scalable vector graphics for the piano interface

### Audio Features
- **Piano Synthesis** - Warm, lofi-character piano sounds with envelope shaping
- **Drum Synthesis** - 7 unique drum sounds using various synthesis methods
- **Effects Processing** - Reverb and compression for professional sound
- **Polyphonic Playback** - Multiple notes can play simultaneously

### Visual Features
- **CSS Animations** - Smooth key press animations with glow effects
- **Backdrop Filters** - Glass-morphism UI elements with blur effects
- **Responsive Design** - Adapts to different screen sizes and orientations
- **Atmospheric Effects** - Floating particles and gradient overlays

## 🎨 Customization

### Changing Sounds
Edit the `drumSynths` object in `script.js` to modify drum sounds:
```javascript
drumSynths = {
    kick: new Tone.MembraneSynth({...}),
    // Modify parameters here
};
```

### Styling Modifications
Customize colors and effects in `style.css`:
```css
.pad.active {
    filter: brightness(1.5) saturate(1.6) drop-shadow(0 0 15px #YOUR_COLOR);
}
```

### Key Mappings
Modify the `keyMappings` object in `script.js` to change keyboard controls.

## 📱 Browser Compatibility

- **Chrome/Chromium** - Full support ✅
- **Firefox** - Full support ✅
- **Safari** - Full support ✅
- **Edge** - Full support ✅

**Note**: Modern browser required for Web Audio API and ES6+ features.

## 🎵 Audio Requirements

- The browser will require user interaction before playing audio (standard web security)
- For best experience, use headphones or quality speakers
- Audio context starts automatically on first interaction

## 🚨 Troubleshooting

### No Sound
1. Check if audio is enabled in your browser
2. Try clicking anywhere on the page to activate audio context
3. Check browser console for error messages
4. Ensure you're using a modern browser with Web Audio API support

### Performance Issues
1. Close other browser tabs playing audio/video
2. Try a different browser
3. Check if hardware acceleration is enabled
4. Lower video quality if possible

### Video Not Playing
1. Ensure the `Lofi Background.mov` file is in the correct location
2. Check browser video codec support
3. Try refreshing the page

## 🎯 Future Enhancements

- [ ] Recording functionality
- [ ] Preset rhythm patterns
- [ ] Volume controls
- [ ] Additional instrument sounds
- [ ] MIDI device support
- [ ] Chord detection and display
- [ ] Loop station functionality

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 💫 Credits

- **Tone.js** - Amazing Web Audio framework
- **SVG Piano Design** - Custom created for this project
- **Lofi Aesthetic** - Inspired by the cozy lofi music community

---

**Enjoy creating beautiful music! 🎵** 