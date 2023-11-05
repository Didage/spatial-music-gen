import torch
from transformers import MusicgenForConditionalGeneration
from transformers import AutoProcessor
import scipy
import numpy as np

from pydub import AudioSegment


class MusicGen:

    device = "cuda:0" if torch.cuda.is_available() else "cpu"
    model = MusicgenForConditionalGeneration.from_pretrained("facebook/musicgen-small")
    model.to(device)
    processor = AutoProcessor.from_pretrained("facebook/musicgen-small")
    generation = 1

    def concatenate_with_crossfade(self, file_paths, output_file, crossfade_duration):
        # Load the first audio file
        combined = AudioSegment.from_wav(file_paths[0])

        # Iterate over the rest of the files, applying crossfade and concatenating
        for file_path in file_paths[1:]:
            next_audio = AudioSegment.from_wav(file_path)
            # Apply crossfade
            combined = combined.append(next_audio, crossfade=crossfade_duration)

        # Export the final audio with crossfades to a new file
        combined.export(output_file, format="wav")

    def generate_music(self, prompt, title):
        device=self.device
        model=self.model
        processor=self.processor
        generation=self.generation

        data = prompt
        print("Generating audio with: " + prompt)
        inputs = processor(
            text=[data],
            padding=True,
            return_tensors="pt",
        )
        sampling_rate = model.config.audio_encoder.sampling_rate

        name = "audios/Gen" + str(generation) + "-" + str(title.replace(" ", "")) + "-musicgen-out"

        audio_values = model.generate(**inputs.to(device), do_sample=True, guidance_scale=3, max_new_tokens=1503)
        scipy.io.wavfile.write(name+"A.wav", rate=sampling_rate, data=audio_values[0, 0].cpu().numpy())
        file1 = name+"A.wav"
        print("Generated file 1")

        audio_values = model.generate(**inputs.to(device), do_sample=True, guidance_scale=3, max_new_tokens=1503)
        scipy.io.wavfile.write(name+"B.wav", rate=sampling_rate, data=audio_values[0, 0].cpu().numpy())
        file2 = name+"B.wav"
        print("Generated file 2")

        audio_values = model.generate(**inputs.to(device), do_sample=True, guidance_scale=3, max_new_tokens=1503)
        scipy.io.wavfile.write(name+"C.wav", rate=sampling_rate, data=audio_values[0, 0].cpu().numpy())
        file3 = name+"C.wav"
        print("Generated file 3")

        generation += 1

        crossfade_duration = 3  # in seconds
        file_paths = [file1, file2, file3]
        output_file = name + "-MASTER.wav"
        crossfade_duration = 3000  # in miliseconds

        self.concatenate_with_crossfade(file_paths, output_file, crossfade_duration)
        return output_file