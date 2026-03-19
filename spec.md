# VoiceFlow TTS App

## Current State
New project — no existing implementation.

## Requested Changes (Diff)

### Add
- Large text input (up to 5000+ chars) with live character counter
- Voice options: male/female dropdown, US/UK/African accent dropdown, speed selector (slow/normal/fast)
- Generate Audio button with loading indicator
- Audio player for previewing generated speech
- Download buttons for MP3 and WAV formats
- History list of previous audio generations, each with play and download buttons
- Backend storage for history entries (text, voice settings, timestamp)

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Backend: Store history entries with text, voice, accent, speed, timestamp using stable var array
2. Backend: Expose addEntry, getHistory, deleteEntry methods
3. Frontend: Text input with character counter, voice/accent/speed controls
4. Frontend: Web Speech API for TTS playback (browser-native, no external API needed)
5. Frontend: MediaRecorder API to capture audio output for download
6. Frontend: History list with play/download per entry
7. Frontend: Loading state while generating
