# Description
The current repository contains the code for running the entire project to generate music with the MusicGen Ai by Meta.

## Instructions:

Install the requirements by running:
```
pip install -r requirements.txt
```

The backend runs over a local postgres database. You must first create that database with the following credentials:
```
psql
postgres# CREATE DATABASE spatial_music_gen_db OWNER postgres;
postgres# ALTER USER postgres WITH PASSWORD '1234';
```

### First, for the audio server (Audio CDN Component)
Inside the audio_server directory run:
```
node audio_server.js
```
### Second, for the model backend (FastAPI and MusicGen Model Components)
Inside the back directory run:
```
python main.py
```
### Lastly, for the frontend (Web Server Component)
Inside the front directory run:
```
npm start
```
