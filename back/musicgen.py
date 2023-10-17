import torch
from transformers import MusicgenForConditionalGeneration
from transformers import AutoProcessor
import scipy
import os

class MusicGen:

    device = "cuda:0" if torch.cuda.is_available() else "cpu"
    model = MusicgenForConditionalGeneration.from_pretrained("facebook/musicgen-small")
    model.to(device)
    processor = AutoProcessor.from_pretrained("facebook/musicgen-small")
    generation = 0

    def generate_music(self, prompt):
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

        print(os.path.isdir("./audios/"))
        name = "./audios/Gen" + str(generation) + "-musicgen-out"

        audio_values = model.generate(**inputs.to(device), do_sample=True, guidance_scale=3, max_new_tokens=1503)
        scipy.io.wavfile.write(name+"A.wav", rate=sampling_rate, data=audio_values[0, 0].cpu().numpy())
        print("Generated file 1")
        audio_values = model.generate(**inputs.to(device), do_sample=True, guidance_scale=3, max_new_tokens=1503)
        scipy.io.wavfile.write(name+"B.wav", rate=sampling_rate, data=audio_values[0, 0].cpu().numpy())

        audio_values = model.generate(**inputs.to(device), do_sample=True, guidance_scale=3, max_new_tokens=1503)
        scipy.io.wavfile.write(name+"C.wav", rate=sampling_rate, data=audio_values[0, 0].cpu().numpy())

        generation += 1

        return [str(name+"A.wav"), str(name+"B.wav"), str(name+"C.wav")]