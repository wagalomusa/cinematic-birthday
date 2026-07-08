#!/usr/bin/env python3
"""Generate minimal silent MP3 placeholders for development preview."""

import struct
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(BASE, "assets", "audio")

FILES = [
    "voice-1.mp3",
    "voice-2.mp3",
    "voice-3.mp3",
    "voice-4.mp3",
    "voice-5.mp3",
    "finale-song.mp3",
]

def create_silent_mp3(path, duration_sec=3):
    """Create a minimal valid-ish MP3 frame sequence (silent)."""
    os.makedirs(os.path.dirname(path), exist_ok=True)

    # Minimal MP3: ID3 header + single silent frame repeated
    # For browser compatibility, write a tiny WAV instead if mp3 fails
    # Browsers accept WAV in audio tags too — use WAV for reliability

    wav_path = path.replace(".mp3", ".wav")
    sample_rate = 22050
    num_samples = sample_rate * duration_sec
    data_size = num_samples * 2
    file_size = 36 + data_size

    with open(wav_path, "wb") as f:
        f.write(b"RIFF")
        f.write(struct.pack("<I", file_size))
        f.write(b"WAVE")
        f.write(b"fmt ")
        f.write(struct.pack("<IHHIIHH", 16, 1, 1, sample_rate, sample_rate * 2, 2, 16))
        f.write(b"data")
        f.write(struct.pack("<I", data_size))
        f.write(b"\x00" * data_size)

    return wav_path


if __name__ == "__main__":
    durations = {
        "voice-1.mp3": 4,
        "voice-2.mp3": 4,
        "voice-3.mp3": 4,
        "voice-4.mp3": 4,
        "voice-5.mp3": 4,
        "finale-song.mp3": 8,
    }

    for name in FILES:
        wav = create_silent_mp3(os.path.join(AUDIO_DIR, name), durations[name])
        print(f"Created {wav}")

    print("\nNote: Replace .wav files with real .mp3 recordings.")
    print("Update index.html src paths if using .mp3 directly.")
