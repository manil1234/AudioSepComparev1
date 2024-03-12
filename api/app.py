import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
import time
from mutagen.mp4 import MP4
from spleeter.separator import Separator
import demucs.separate
from computeMetrics import compute_metrics


app = Flask(__name__)

# Configure the SQLAlchemy database
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///comparisons.db'

# Avoid alphabetical ordering of JSON keys
app.json.sort_keys = False

# Initialize the SQLAlchemy database instance
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Import after to avoid circular imports
from models import Comparisons

# Create Flask-Admin instance
admin = Admin(app, name='Admin Panel', template_mode='bootstrap3')

# Add views for your models
admin.add_view(ModelView(Comparisons, db.session))

# Define the folder path where the songs are located
SONGS_FOLDER = '../musdb18'

# Define the folder path where the separated stems will be saved
SPLEETER_FOLDER = '../spleeter'
DEMUCS_FOLDER = '../demucs'


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
    
    # Check if metrics for the song already exist in the database
    existing_comparison = Comparisons.query.filter_by(song=song_id).first()
    if existing_comparison:
        # Metrics already exist, return them
        return jsonify({
            "Spleeter": {
                "bass": {
                    "Average ISR": existing_comparison.spleeter_bass_ISR,
                    "Average SAR": existing_comparison.spleeter_bass_SAR,
                    "Average SDR": existing_comparison.spleeter_bass_SDR,
                },
                "drums": {
                    "Average ISR": existing_comparison.spleeter_drums_ISR,
                    "Average SAR": existing_comparison.spleeter_drums_SAR,
                    "Average SDR": existing_comparison.spleeter_drums_SDR,
                },
                "other": {
                    "Average ISR": existing_comparison.spleeter_other_ISR,
                    "Average SAR": existing_comparison.spleeter_other_SAR,
                    "Average SDR": existing_comparison.spleeter_other_SDR,
                },
                "vocals": {
                    "Average ISR": existing_comparison.spleeter_vocals_ISR,
                    "Average SAR": existing_comparison.spleeter_vocals_SAR,
                    "Average SDR": existing_comparison.spleeter_vocals_SDR,
                },
                "overall": {
                    "Average SDR": existing_comparison.spleeter_overall_SDR,
                    "Time": existing_comparison.spleeter_overall_time
                }
            },
            "Demucs": {
                "bass": {
                    "Average ISR": existing_comparison.demucs_bass_ISR,
                    "Average SAR": existing_comparison.demucs_bass_SAR,
                    "Average SDR": existing_comparison.demucs_bass_SDR,
                },
                "drums": {
                    "Average ISR": existing_comparison.demucs_drums_ISR,
                    "Average SAR": existing_comparison.demucs_drums_SAR,
                    "Average SDR": existing_comparison.demucs_drums_SDR,
                },
                "other": {
                    "Average ISR": existing_comparison.demucs_other_ISR,
                    "Average SAR": existing_comparison.demucs_other_SAR,
                    "Average SDR": existing_comparison.demucs_other_SDR,
                },
                "vocals": {
                    "Average ISR": existing_comparison.demucs_vocals_ISR,
                    "Average SAR": existing_comparison.demucs_vocals_SAR,
                    "Average SDR": existing_comparison.demucs_vocals_SDR,
                },
                "overall": {
                    "Average SDR": existing_comparison.demucs_overall_SDR,
                    "Time": existing_comparison.demucs_overall_time
                }
            }
        })

    # Perform separation using Spleeter
    spleeter_output_folder = os.path.join(SPLEETER_FOLDER, song_id)
    if not os.path.exists(spleeter_output_folder):
        try:
            os.makedirs(spleeter_output_folder, exist_ok=True)
            start_time_spleeter = time.time()  # Record start time
            spleeter_separate_audio(song_path)
            end_time_spleeter = time.time()  # Record end time
            spleeter_time = end_time_spleeter - start_time_spleeter  # Calculate time taken
            # Compute metrics for Spleeter output
            spleeter_metrics = compute_metrics(song_path, spleeter_output_folder)
        except Exception as e:
            return jsonify({"error": f"Failed to separate audio and evaluate with Spleeter: {str(e)}"}), 500
    else:
        return jsonify(f"Spleeter output folder already exists: {spleeter_output_folder} but metrics not found")

    # Perform separation using Demucs
    demucs_output_folder = os.path.join(DEMUCS_FOLDER + "/htdemucs", song_id)
    if not os.path.exists(demucs_output_folder):
        try:
            os.makedirs(demucs_output_folder, exist_ok=True)
            start_time_demucs = time.time()  # Record start time
            demucs_separate_audio(song_path)
            end_time_demucs = time.time()  # Record end time
            demucs_time = end_time_demucs - start_time_demucs  # Calculate time taken
            # Compute metrics for Demucs output
            demucs_metrics = compute_metrics(song_path, demucs_output_folder)
        except Exception as e:
            return jsonify({"error": f"Failed to separate audio and evaluate with Demucs: {str(e)}"}), 500
    else:
        return jsonify(f"Demucs output folder already exists: {demucs_output_folder} but metrics not found")
    
    try:
        # Save metrics to the database
        print("Saving metrics to the database...")
        new_comparison = Comparisons(
            song=song_id,
            spleeter_bass_ISR = spleeter_metrics['bass']['Average ISR'],
            spleeter_bass_SAR = spleeter_metrics['bass']['Average SAR'],
            spleeter_bass_SDR = spleeter_metrics['bass']['Average SDR'],

            spleeter_drums_ISR = spleeter_metrics['drums']['Average ISR'],
            spleeter_drums_SAR = spleeter_metrics['drums']['Average SAR'],
            spleeter_drums_SDR = spleeter_metrics['drums']['Average SDR'],

            spleeter_other_ISR = spleeter_metrics['other']['Average ISR'],
            spleeter_other_SAR = spleeter_metrics['other']['Average SAR'],
            spleeter_other_SDR = spleeter_metrics['other']['Average SDR'],

            spleeter_vocals_ISR = spleeter_metrics['vocals']['Average ISR'],
            spleeter_vocals_SAR = spleeter_metrics['vocals']['Average SAR'],
            spleeter_vocals_SDR = spleeter_metrics['vocals']['Average SDR'],

            spleeter_overall_SDR = spleeter_metrics['overall']['Average SDR'],
            spleeter_overall_time = spleeter_time,

            demucs_bass_ISR = demucs_metrics['bass']['Average ISR'],
            demucs_bass_SAR = demucs_metrics['bass']['Average SAR'],
            demucs_bass_SDR = demucs_metrics['bass']['Average SDR'],

            demucs_drums_ISR = demucs_metrics['drums']['Average ISR'],
            demucs_drums_SAR = demucs_metrics['drums']['Average SAR'],
            demucs_drums_SDR = demucs_metrics['drums']['Average SDR'],

            demucs_other_ISR = demucs_metrics['other']['Average ISR'],
            demucs_other_SAR = demucs_metrics['other']['Average SAR'],
            demucs_other_SDR = demucs_metrics['other']['Average SDR'],

            demucs_vocals_ISR = demucs_metrics['vocals']['Average ISR'],
            demucs_vocals_SAR = demucs_metrics['vocals']['Average SAR'],
            demucs_vocals_SDR = demucs_metrics['vocals']['Average SDR'],

            demucs_overall_SDR = demucs_metrics['overall']['Average SDR'],
            demucs_overall_time = demucs_time
        )
        db.session.add(new_comparison)
        db.session.commit()
    except Exception as e:
        print({f"Failed to save metrics to the database: {str(e)}"})
    # Return metrics as JSON
    return jsonify({
        "Spleeter": spleeter_metrics,
        "Spleeter Time ": spleeter_time,
        "Demucs": demucs_metrics,
        "Demucs Time": demucs_time
    })

def spleeter_separate_audio(input_file):
    """
    Function to perform audio separation using Spleeter.
    """
    print("Separating audio using Spleeter...")
    # Initialize Spleeter separator
    separator = Separator('spleeter:4stems')
    # Perform separation
    separator.separate_to_file(input_file, SPLEETER_FOLDER)

def demucs_separate_audio(input_file):
    """
    Function to perform audio separation using Demucs.
    """
    print("Separating audio using Demucs...")
    # Create the output folder if it doesn't exist
    # os.makedirs(DEMUCS_FOLDER, exist_ok=True)

    # Perform separation using Demucs with default settings
    demucs.separate.main(["-n", "htdemucs", "--out", DEMUCS_FOLDER, input_file])

    return DEMUCS_FOLDER  # Return the folder path where the stems are saved

if __name__ == '__main__':
    app.run(debug=True)
