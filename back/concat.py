from pydub import AudioSegment

def concatenate_with_crossfade(file_paths, output_file, crossfade_duration):
    # Load the first audio file
    combined = AudioSegment.from_wav(file_paths[0])

    # Iterate over the rest of the files, applying crossfade and concatenating
    for file_path in file_paths[1:]:
        next_audio = AudioSegment.from_wav(file_path)
        # Apply crossfade
        combined = combined.append(next_audio, crossfade=crossfade_duration)

    # Export the final audio with crossfades to a new file
    combined.export(output_file, format="wav")

# Replace with your actual file paths
file_paths = ['audios/Gen1-Musicformyhomestudio-musicgen-outA.wav', 'audios/Gen1-Musicformyhomestudio-musicgen-outB.wav', 'audios/Gen1-Musicformyhomestudio-musicgen-outC.wav']
output_file = 'audios/combined_files_with_crossfade.wav'
crossfade_duration = 3000  # in miliseconds

concatenate_with_crossfade(file_paths, output_file, crossfade_duration)