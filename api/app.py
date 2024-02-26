import os
from flask import Flask, jsonify
from mutagen.mp4 import MP4

app = Flask(__name__)

# Define the folder path where the songs are located
SONGS_FOLDER = '../musdb18'

@app.route('/')
def index():
    return 'Welcome to the the Audio Source Seperation Comparrson Tool!'

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

if __name__ == '__main__':
    app.run(debug=True)
