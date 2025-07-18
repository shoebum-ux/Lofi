// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎹 Lofi Piano Experience Loading...');
    
    // Add loading state
    document.body.classList.add('loading');
    
    // Initialize audio context and instruments
    await initializeAudio();
    
    // Set up event listeners
    setupEventListeners();
    
    // Remove loading state
    document.body.classList.remove('loading');
    
    console.log('🎵 Ready to play!');
});

// Audio setup
let pianoSynth;
let drumSynths = {};
let padPlayers = {}; // Custom WAV file players for pads
let reverb;
let compressor;
let backingTrack;
let isAudioInitialized = false;
let backingTrackStarted = false;
let instructionTextVisible = true;

// Key mappings
const keyMappings = {
    // Numbers 1-7 for pads (drum sounds)
    49: { type: 'pad', note: 'C4', element: null }, // 1
    50: { type: 'pad', note: 'D4', element: null }, // 2
    51: { type: 'pad', note: 'E4', element: null }, // 3
    52: { type: 'pad', note: 'F4', element: null }, // 4
    53: { type: 'pad', note: 'G4', element: null }, // 5
    54: { type: 'pad', note: 'A4', element: null }, // 6
    55: { type: 'pad', note: 'B4', element: null }, // 7
    
    // QWERTY row for black keys (chromatic notes for D minor)
    81: { type: 'black-key', note: 'Eb3', element: null }, // Q
    87: { type: 'black-key', note: 'F#3', element: null }, // W  
    69: { type: 'black-key', note: 'Ab3', element: null }, // E
    82: { type: 'black-key', note: 'B3', element: null }, // R
    84: { type: 'black-key', note: 'Db4', element: null }, // T
    89: { type: 'black-key', note: 'Eb4', element: null }, // Y
    85: { type: 'black-key', note: 'F#4', element: null }, // U
    73: { type: 'black-key', note: 'Ab4', element: null }, // I
    79: { type: 'black-key', note: 'B4', element: null }, // O
    80: { type: 'black-key', note: 'Db5', element: null }, // P
    219: { type: 'black-key', note: 'Eb5', element: null }, // [
    221: { type: 'black-key', note: 'F#5', element: null }, // ]
    
    // ASDF row for white keys - D minor scale
    65: { type: 'white-key', note: 'D3', element: null }, // A - sa (D)
    83: { type: 'white-key', note: 'E3', element: null }, // S - re (E)
    68: { type: 'white-key', note: 'F3', element: null }, // D - ga (F)
    70: { type: 'white-key', note: 'G3', element: null }, // F - ma (G)
    71: { type: 'white-key', note: 'A3', element: null }, // G - pa (A)
    72: { type: 'white-key', note: 'Bb3', element: null }, // H - dha (Bb)
    74: { type: 'white-key', note: 'C4', element: null }, // J - ni (C)
    75: { type: 'white-key', note: 'D4', element: null }, // K - sa (D)
    76: { type: 'white-key', note: 'E4', element: null }, // L - re (E)
    186: { type: 'white-key', note: 'F4', element: null }, // ; - ga (F)
    222: { type: 'white-key', note: 'G4', element: null }, // ' - ma (G)
    
    // ZXCV row for additional white keys - continuing D minor scale
    90: { type: 'white-key', note: 'A4', element: null }, // Z - pa (A)
    88: { type: 'white-key', note: 'Bb4', element: null }, // X - dha (Bb)
    67: { type: 'white-key', note: 'C5', element: null }, // C - ni (C)
    86: { type: 'white-key', note: 'D5', element: null }, // V - sa (D)
    66: { type: 'white-key', note: 'E5', element: null }, // B - re (E)
    78: { type: 'white-key', note: 'F5', element: null }, // N - ga (F)
    77: { type: 'white-key', note: 'G5', element: null }  // M - ma (G)
};

// Track pressed keys to prevent repeats
const pressedKeys = new Set();

// Initialize Tone.js audio
async function initializeAudio() {
    try {
        // Start audio context
        await Tone.start();
        console.log('🔊 Audio context started');
        
        // Create effects
        reverb = new Tone.Reverb({
            decay: 3,
            wet: 0.3
        }).toDestination();
        
        compressor = new Tone.Compressor({
            threshold: -20,
            ratio: 3,
            attack: 0.003,
            release: 0.1
        });
        
        // Bass enhancement for drums
        const bassBoost = new Tone.EQ3({
            low: 8,
            mid: 0,
            high: -2
        });
        
        // Create piano synthesizer with warm, lofi character
        pianoSynth = new Tone.PolySynth(Tone.Synth, {
            oscillator: {
                type: "sine"
            },
            envelope: {
                attack: 0.02,
                decay: 0.3,
                sustain: 0.6,
                release: 1.2
            },
            filter: {
                Q: 2,
                frequency: 1000,
                type: "lowpass"
            },
            filterEnvelope: {
                attack: 0.02,
                decay: 0.1,
                sustain: 0.5,
                release: 0.8,
                baseFrequency: 200,
                octaves: 3
            }
        }).chain(compressor, reverb);
        
        // Load custom pad sounds from WAV files
        padPlayers = {};
        for (let i = 1; i <= 7; i++) {
            const padNumber = i.toString().padStart(2, '0'); // Convert 1 to "01", 2 to "02", etc.
            padPlayers[`pad${i}`] = new Tone.Player({
                url: `PADs/PAD${padNumber}.wav`,
                autostart: false
            }).chain(bassBoost, compressor, reverb);
            
            console.log(`🔊 Loading PAD${padNumber}.wav for pad ${i}`);
        }
        
        // Keep some backup drum synths for fallback (not used for pads)
        drumSynths = {
            kick: new Tone.MembraneSynth({
                pitchDecay: 0.01,
                octaves: 10,
                oscillator: { type: "sine" },
                envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.8 }
            }).chain(bassBoost, compressor, reverb)
        };
        
        // Initialize backing track
        backingTrack = document.getElementById('backing-track');
        if (backingTrack) {
            backingTrack.volume = 0.6; // 60% volume
            console.log('🎵 Backing track initialized at 60% volume');
        }

        isAudioInitialized = true;
        console.log('🎛️ Audio instruments initialized');
        
    } catch (error) {
        console.error('❌ Audio initialization failed:', error);
    }
}

// Visual element remapping - keep sound but change visual
// A-K (Vector 1-8) are already correct visually
const visualRemapping = {
    70: 76, // F shows L's visual element  
    71: 90, // G shows Z's visual element
    72: 88, // H shows X's visual element  
    74: 70, // J shows F's visual element
    75: 186, // K shows ;'s visual element (data-key="186")
    
    // L onwards mapping
    76: 67,   // L shows data-key="67"
    186: 71,  // ; shows data-key="71" (as requested)
    222: 222, // ' shows data-key="222" (default)
    90: 86,   // Z shows data-key="86"
    88: 66,   // X shows data-key="66"
    67: 72,   // C shows data-key="72"
    86: 13,   // V shows data-key="13"
    66: 78,   // B shows data-key="78"
    78: 74,   // N shows data-key="74"
    77: 75,   // M shows data-key="75"
    89: 85,   // Y shows data-key="85"
    85: 89    // U shows data-key="89"
};

// Map SVG elements to key codes
function mapElements() {
    // First, see what data-keys actually exist in HTML
    const existingDataKeys = [];
    document.querySelectorAll('[data-key]').forEach(element => {
        existingDataKeys.push(element.dataset.key);
    });
    console.log('🔍 Found data-keys in HTML:', existingDataKeys.sort());
    
    // Check which white keys we expect but might be missing
    const expectedWhiteKeys = [65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222, 13, 90, 88, 67, 86, 66, 78];
    const missingKeys = expectedWhiteKeys.filter(key => !existingDataKeys.includes(key.toString()));
    if (missingKeys.length > 0) {
        console.log('❌ Missing data-keys:', missingKeys);
    }
    
    document.querySelectorAll('[data-key]').forEach(element => {
        const keyCode = parseInt(element.dataset.key);
        if (keyMappings[keyCode]) {
            keyMappings[keyCode].element = element;
            console.log(`🔗 Mapped key ${keyCode} (${keyMappings[keyCode].note}) to element:`, element);
        }
    });
    
    // Apply visual remapping
    Object.keys(visualRemapping).forEach(sourceKey => {
        const targetKey = visualRemapping[sourceKey];
        const sourceKeyCode = parseInt(sourceKey);
        const targetElement = document.querySelector(`[data-key="${targetKey}"]`);
        
        if (keyMappings[sourceKeyCode] && targetElement) {
            keyMappings[sourceKeyCode].element = targetElement;
            console.log(`🔄 Remapped key ${sourceKeyCode} to show element from key ${targetKey}`);
            
            // Special debugging for K and ;
            if (sourceKeyCode == 75) {
                console.log(`🔍 K (75) now shows element:`, targetElement, `data-key="${targetKey}"`);
            }
            if (sourceKeyCode == 186) {
                console.log(`🔍 ; (186) now shows element:`, targetElement, `data-key="${targetKey}"`);
            }
        } else if (!targetElement) {
            console.log(`❌ Could not find target element with data-key="${targetKey}" for source key ${sourceKeyCode}`);
        }
    });
    
    console.log('🗺️ Elements mapped to keys (with visual remapping)', keyMappings);
}

// Setup all event listeners
function setupEventListeners() {
    mapElements();
    
    // Keyboard events
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Mouse/touch events for SVG elements
    document.querySelectorAll('.pad, .white-key, .black-key').forEach(element => {
        element.addEventListener('mousedown', handleMouseDown);
        element.addEventListener('mouseup', handleMouseUp);
        element.addEventListener('mouseleave', handleMouseUp);
        element.addEventListener('touchstart', handleTouchStart, { passive: false });
        element.addEventListener('touchend', handleTouchEnd, { passive: false });
    });
    
    // Video interaction
    const video = document.getElementById('bg-video');
    video.addEventListener('click', () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });
    
    console.log('👂 Event listeners setup complete');
}

// Hide instruction text and keyboard controls on first interaction
function hideInstructionText() {
    if (instructionTextVisible) {
        const instructionElement = document.getElementById('instruction-text');
        const keyboardControlsElement = document.getElementById('keyboard-controls');
        
        if (instructionElement) {
            instructionElement.classList.add('hidden');
        }
        
        // Hide keyboard controls after 10 seconds with fade out
        if (keyboardControlsElement) {
            setTimeout(() => {
                keyboardControlsElement.classList.add('fade-out');
                console.log('📝 Keyboard controls fading out after 10 seconds');
            }, 10000); // 10 seconds = 10,000 milliseconds
        }
        
        instructionTextVisible = false;
        console.log('📝 Instruction text hidden, keyboard controls will fade out in 10 seconds');
    }
}

// Handle keyboard key press
function handleKeyDown(event) {
    // Hide instruction text on first interaction
    hideInstructionText();
    
    // Prevent browser shortcuts and defaults
    event.preventDefault();
    
    const keyCode = event.keyCode;
    console.log(`⌨️ Key pressed: ${keyCode} (${String.fromCharCode(keyCode)})`);
    
    // Ignore if key is already pressed or not mapped
    if (pressedKeys.has(keyCode) || !keyMappings[keyCode]) {
        if (!keyMappings[keyCode]) {
            console.log(`❌ Key ${keyCode} not mapped`);
        }
        return;
    }
    
    pressedKeys.add(keyCode);
    const mapping = keyMappings[keyCode];
    console.log(`🎯 Found mapping:`, mapping);
    
    if (mapping.element) {
        activateKey(mapping.element, mapping.type, mapping.note);
    } else {
        console.log(`❌ No element found for key ${keyCode}`);
    }
}

// Handle keyboard key release
function handleKeyUp(event) {
    const keyCode = event.keyCode;
    
    if (pressedKeys.has(keyCode)) {
        pressedKeys.delete(keyCode);
        const mapping = keyMappings[keyCode];
        
        if (mapping.element) {
            deactivateKey(mapping.element);
        }
    }
}

// Handle mouse press
function handleMouseDown(event) {
    // Hide instruction text on first interaction
    hideInstructionText();
    
    event.preventDefault();
    const element = event.currentTarget;
    const keyType = element.classList.contains('pad') ? 'pad' : 
                   element.classList.contains('white-key') ? 'white-key' : 'black-key';
    const note = element.dataset.note;
    
    activateKey(element, keyType, note);
}

// Handle mouse release
function handleMouseUp(event) {
    const element = event.currentTarget;
    deactivateKey(element);
}

// Handle touch start
function handleTouchStart(event) {
    // Hide instruction text on first interaction
    hideInstructionText();
    
    event.preventDefault();
    const element = event.currentTarget;
    const keyCode = parseInt(element.dataset.key);
    
    if (!pressedKeys.has(keyCode)) {
        pressedKeys.add(keyCode);
        activateKey(element, keyCode);
    }
}

// Handle touch end
function handleTouchEnd(event) {
    event.preventDefault();
    handleMouseUp(event);
}

// Activate a key (visual and audio)
function activateKey(element, keyType, note) {
    if (!isAudioInitialized) return;
    
    console.log(`🎹 Activating ${keyType} - ${note}`, element);
    
    // Visual feedback
    element.classList.add('active');
    console.log(`✨ Added 'active' class to`, element);
    
    // Audio feedback
    playSound(keyType, note);
}

// Deactivate a key (visual only)
function deactivateKey(element) {
    element.classList.remove('active');
}

// Play sound based on key type and note
function playSound(keyType, note) {
    if (!isAudioInitialized) return;
    
    try {
        if (keyType === 'pad') {
            // Use custom WAV files for pads (keys 1-7)
            const noteIndex = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'].indexOf(note);
            const padNumber = noteIndex + 1; // Convert index to pad number (1-7)
            
            if (padNumber >= 1 && padNumber <= 7 && padPlayers[`pad${padNumber}`]) {
                console.log(`🎵 Playing custom PAD${padNumber.toString().padStart(2, '0')}.wav`);
                // Stop any currently playing instance of this pad
                if (padPlayers[`pad${padNumber}`].state === 'started') {
                    padPlayers[`pad${padNumber}`].stop();
                }
                // Start the pad sound
                padPlayers[`pad${padNumber}`].start();
            } else {
                console.warn(`❌ Pad ${padNumber} not found or invalid`);
            }
        } else {
            // Play piano sounds for white and black keys
            pianoSynth.triggerAttackRelease(note, '4n');
        }
    } catch (error) {
        console.error('🚫 Sound playback error:', error);
    }
}

// Utility function to handle audio context activation
function enableAudio() {
    if (Tone.context.state !== 'running') {
        Tone.context.resume().then(() => {
            console.log('🔊 Audio context resumed');
            startBackingTrack();
        });
    } else {
        startBackingTrack();
    }
}

// Start backing track after first user interaction
function startBackingTrack() {
    if (backingTrack && !backingTrackStarted) {
        backingTrack.play().then(() => {
            backingTrackStarted = true;
            console.log('🎶 Backing track started playing in loop');
        }).catch(error => {
            console.error('❌ Failed to start backing track:', error);
        });
    }
}

// Add click handler to enable audio on user interaction
document.addEventListener('click', enableAudio, { once: true });
document.addEventListener('keydown', enableAudio, { once: true });

// Handle window visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Clear all active states when tab becomes hidden
        pressedKeys.clear();
        document.querySelectorAll('.active').forEach(element => {
            element.classList.remove('active');
        });
    }
});

// Handle window blur (focus lost)
window.addEventListener('blur', () => {
    // Clear all active states when window loses focus
    pressedKeys.clear();
    document.querySelectorAll('.active').forEach(element => {
        element.classList.remove('active');
    });
});

// Add some visual feedback for loading
console.log('🎹 Lofi Piano Experience Script Loaded');

// Error handling
window.addEventListener('error', (event) => {
    console.error('💥 Global error:', event.error);
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled promise rejection:', event.reason);
});

// Export for debugging (optional)
if (typeof window !== 'undefined') {
    window.LofiPiano = {
        keyMappings,
        pressedKeys,
        pianoSynth,
        drumSynths,
        padPlayers,
        playSound,
        activateKey,
        deactivateKey
    };
} 