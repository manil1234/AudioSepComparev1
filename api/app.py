import os
from flask import Flask, jsonify, request
from models import db, Comparisons
from admin import admin
from mutagen.mp4 import MP4
from spleeter.separator import Separator
import demucs.separate
import numpy as np
from museval.metrics import bss_eval
from pydub import AudioSegment


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///comparisons.db'
db.init_app(app)

# Define the folder path where the songs are located
SONGS_FOLDER = '../musdb18'

# Define the folder path where the separated stems will be saved
SPLEETER_FOLDER = '../spleeter'
DEMUCS_FOLDER = '../demucs'

# Register Flask-Admin with the Flask application
admin.init_app(app)

# Create database tables
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return 'Welcome to the the Audio Source Separation Comparison Tool!'

def get_song_metadata(song_filename):
    """
    Helper function to retrieve metadata from an MP4 song file.
    """
    song_path = os.path.join(SONGS_FOLDER, song_filename)
    if os.path.exists(song_path):
        try:
            audio = MP4(song_path)
            artist = audio.tags.get('artist', ['Unknown'])[0]
            duration = int(audio.info.length)  # Duration in seconds
            return artist, duration
        except Exception as e:
            print(f"Error retrieving metadata for {song_filename}: {e}")
    return "Unknown", 0

@app.route('/songs', methods=['GET'])
def get_songs():
    """
    Endpoint to retrieve a list of available songs.
    """
    songs_metadata = []
    for filename in os.listdir(SONGS_FOLDER):
        if filename.endswith('.mp4'):
            song_id = os.path.splitext(filename)[0]
            artist, duration = get_song_metadata(filename)
            song_metadata = {
                "id": song_id,
                "title": song_id,  # Assuming the file name as the title
                "artist": artist,
                "duration": duration,
                "audio_url": f'/songs/{song_id}'
            }
            songs_metadata.append(song_metadata)
    return jsonify(songs_metadata)

@app.route('/songs/<song_id>', methods=['GET'])
def get_song(song_id):
    """
    Endpoint to retrieve a specific song.
    """
    song_filename = f"{song_id}.mp4"
    song_path = os.path.join(SONGS_FOLDER, song_filename)
    if os.path.exists(song_path):
        # Return the song file or its URL depending on your requirements
        return song_path  # Or return the URL to play the song directly
    else:
        return jsonify({"error": "Song not found"}), 404

@app.route('/separate/<song_id>', methods=['POST'])
def separate_audio(song_id):
    """
    Endpoint to separate audio using Spleeter and Demucs.
    """
    song_filename = f"{song_id}.mp4"
    song_path = os.path.join(SONGS_FOLDER, song_filename)
    if not os.path.exists(song_path):
        return jsonify({"error": "Song not found"}), 404

#   # Perform separation using Spleeter
    spleeter_output_folder = os.path.join(SPLEETER_FOLDER, song_id)
    os.makedirs(spleeter_output_folder, exist_ok=True)
#     try:
#         spleeter_separate_audio(song_path, spleeter_output_folder)
#     except Exception as e:
#         return jsonify({"error": f"Failed to separate audio with Spleeter: {str(e)}"}), 500

# # Perform separation using Demucs
#     demucs_output_folder = os.path.join(DEMUCS_FOLDER, song_id)
#     os.makedirs(demucs_output_folder, exist_ok=True)
#     try:
#         demucs_separate_audio(song_path)
#     except Exception as e:
#         return jsonify({"error": f"Failed to separate audio: {str(e)}"}), 500
    
    print("\nSong ID: ", song_id)
    print("Song Path: ", song_path)
    print("Spleeter Output Folder: ", spleeter_output_folder, "\n")
    
    print("Comparing Spleeter output:")
    compare(song_path, spleeter_output_folder)

    return jsonify({"message": "Separation completed successfully."})

def spleeter_separate_audio(input_file, output_folder):
    """
    Function to perform audio separation using Spleeter.
    """
    # Initialize Spleeter separator
    separator = Separator('spleeter:4stems')
    # Perform separation
    separator.separate_to_file(input_file, output_folder)

def demucs_separate_audio(input_file):
    """
    Function to perform audio separation using Demucs.
    """
    # Create the output folder if it doesn't exist
    output_folder = os.path.join(DEMUCS_FOLDER, os.path.splitext(os.path.basename(input_file))[0])
    os.makedirs(output_folder, exist_ok=True)

    # Perform separation using Demucs with default settings
    demucs.separate.main(["--out", output_folder, input_file])

    return output_folder  # Return the folder path where the stems are saved

def load_audio(audio_path):
    """
    Load audio file from path using Pydub.
    """
    return AudioSegment.from_file(audio_path)

def compare(song_path, separated_stems_folder):
    """
    Compare separated stems with original stems and print the SDR.
    """
    # Load original multitrack stem
    original_mixture_path = song_path
    if not os.path.exists(original_mixture_path):
        print(f"Original mixture stem not found: {original_mixture_path}")
        return

    original_mixture = load_audio(original_mixture_path)

    # Load separated stems
    separated_stems = {}
    for stem_name in ['drums', 'bass', 'other', 'vocals']:
        stem_path = os.path.join(separated_stems_folder, f"{stem_name}.wav")
        if not os.path.exists(stem_path):
            print(f"Separated {stem_name} stem not found: {stem_path}")
            return
        separated_stems[stem_name] = load_audio(stem_path)
    
    print("\nSpleeter stems loaded\n")

    # Compute SDR for each stem
    sdr, isr, sir, sar, perm = compute_sdr(original_mixture, separated_stems)

    # Print SDR for each stem
    for stem_name, sdr_value in sdr.items():
        print(f"{stem_name} SDR: {sdr_value}")

def compute_sdr(original_mixture, separated_stems):
    """
    Compute Source-to-Distortion Ratio (SDR) for separated stems compared to original mixture.
    """
    # Convert original_mixture to numpy array
    original_samples = np.array(original_mixture.get_array_of_samples())
    
    # Convert separated_stems to numpy arrays
    separated_samples = {stem_name: np.array(stem.get_array_of_samples()) for stem_name, stem in separated_stems.items()}
    
    # Compute SDR values
    sdr = {}
    isr = {}
    sir = {}
    sar = {}
    perm = {}
    avg_sdr = {}  # Initialize avg_sdr dictionary
    for stem_name, separated_signal in separated_samples.items():
        # Extract the corresponding original mixture signal
        original_signal = original_samples  # Use the entire mixture as the original signal
        
        # Compute SDR for the stem
        sdr[stem_name], isr[stem_name], sir[stem_name], sar[stem_name], perm[stem_name] = bss_eval([original_signal], [separated_signal])
        
        # Filter NaN values
        valid_sdr_values = sdr[stem_name][~np.isnan(sdr[stem_name])]
        
        # Calculate the average SDR for the stem, skipping NaN values
        avg_sdr[stem_name] = np.mean(valid_sdr_values) if len(valid_sdr_values) > 0 else np.nan


    return avg_sdr, isr, sir, sar, perm


if __name__ == '__main__':
    app.run(debug=True)
