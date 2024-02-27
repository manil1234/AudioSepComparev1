import requests

# Base URL of your Flask server
BASE_URL = 'http://localhost:5000'

def get_songs():
    """
    Function to retrieve the list of available songs.
    """
    response = requests.get(f'{BASE_URL}/songs')
    if response.status_code == 200:
        songs = response.json()
        print("Available songs:")
        for song in songs:
            print(f"ID: {song['id']}, Title: {song['title']}, Artist: {song['artist']}, Duration: {song['duration']}")
    else:
        print('Error:', response.text)

def separate_song(song_id):
    """
    Function to separate audio for a specific song ID.
    """
    response = requests.post(f'{BASE_URL}/separate/{song_id}')
    if response.status_code == 200:
        print('Separation request successful!')
        print(response.json())
    else:
        print('Error:', response.text)

if __name__ == '__main__':
    while True:
        print("\nCommands:")
        print("1. 'songs' - Get the list of available songs")
        print("2. 'separate <song_id>' - Separate audio for a specific song ID")
        print("3. 'exit' - Exit the program")
        user_input = input("separate PR - Oh No.stem \n Enter command: ").strip()

        if user_input.lower() == 'songs':
            get_songs()
        elif user_input.lower().startswith('separate'):
            _, song_id = user_input.split(maxsplit=1)
            separate_song(song_id)
        elif user_input.lower() == 'exit':
            print("Exiting the program...")
            break
        else:
            print("Invalid command. Please try again.")
