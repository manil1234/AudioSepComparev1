import os
from flask import Flask, jsonify, request
from models import db, Comparisons
from admin import admin
from mutagen.mp4 import MP4
from spleeter.separator import Separator
import demucs.separate
from computeMetrics import compute_metrics


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

    # Perform separation using Spleeter
    spleeter_output_folder = os.path.join(SPLEETER_FOLDER, song_id)
    if not os.path.exists(spleeter_output_folder):
        try:
            os.makedirs(spleeter_output_folder, exist_ok=True)
            spleeter_separate_audio(song_path, spleeter_output_folder)
        except Exception as e:
            return jsonify({"error": f"Failed to separate audio with Spleeter: {str(e)}"}), 500
    else:
        print(f"Spleeter output folder already exists: {spleeter_output_folder}")

    # Perform separation using Demucs
    demucs_output_folder = os.path.join(DEMUCS_FOLDER + "/htdemucs", song_id)
    if not os.path.exists(demucs_output_folder):
        try:
            os.makedirs(demucs_output_folder, exist_ok=True)
            demucs_separate_audio(song_path)
        except Exception as e:
            return jsonify({"error": f"Failed to separate audio: {str(e)}"}), 500
    else:
        print(f"Demucs output folder already exists: {demucs_output_folder}")
    
    # print("\nSong ID: ", song_id)
    # print("Song Path: ", song_path)
    # print("Spleeter Output Folder: ", spleeter_output_folder, "\n")
    
    # Compute metrics for Spleeter output
    spleeter_metrics = compute_metrics(song_path, spleeter_output_folder)

    # Compute metrics for Demucs output
    demucs_metrics = compute_metrics(song_path, demucs_output_folder)

    # Return metrics as JSON
    return jsonify({
        "Spleeter": spleeter_metrics,
        "Demucs": demucs_metrics
    })

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
    os.makedirs(DEMUCS_FOLDER, exist_ok=True)

    # Perform separation using Demucs with default settings
    demucs.separate.main(["-n", "htdemucs", "--out", DEMUCS_FOLDER, input_file])

    return DEMUCS_FOLDER  # Return the folder path where the stems are saved

if __name__ == '__main__':
    app.run(debug=True)
