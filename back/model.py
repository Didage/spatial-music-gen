import torch
from transformers import MusicgenForConditionalGeneration
from transformers import AutoProcessor
from IPython.display import Audio
import scipy

device = "cuda:0" if torch.cuda.is_available() else "cpu"
model = MusicgenForConditionalGeneration.from_pretrained("facebook/musicgen-small")
model.to(device)
processor = AutoProcessor.from_pretrained("facebook/musicgen-small")

generation = 0
while(True):

    print("Write a prompt!")
    data = input()

    inputs = processor(
        text=[data],
        padding=True,
        return_tensors="pt",
    )
    sampling_rate = model.config.audio_encoder.sampling_rate


    name = "audios/Gen" + str(generation) + "-musicgen-out"

    audio_values = model.generate(**inputs.to(device), do_sample=True, guidance_scale=3, max_new_tokens=1503)
    scipy.io.wavfile.write(name+"A.wav", rate=sampling_rate, data=audio_values[0, 0].cpu().numpy())

    audio_values = model.generate(**inputs.to(device), do_sample=True, guidance_scale=3, max_new_tokens=1503)
    scipy.io.wavfile.write(name+"B.wav", rate=sampling_rate, data=audio_values[0, 0].cpu().numpy())

    audio_values = model.generate(**inputs.to(device), do_sample=True, guidance_scale=3, max_new_tokens=1503)
    scipy.io.wavfile.write(name+"C.wav", rate=sampling_rate, data=audio_values[0, 0].cpu().numpy())

    generation += 1