#%%
# importing required modules
from PyPDF2 import PdfReader
 
def normalize_text(text):
    return text.lower().replace(' ', '').replace('\n', '')

precription_file = 'ian_example.pdf'
reader = PdfReader(precription_file)
 

medicine_list = ['EPINEPHrine', 'fluticasone propionate', 'Fexofenadine HCl', 'fluticasone propionate', 'Multivitamins']
norm_med_list = [normalize_text(m) for m in medicine_list]

texts = [page.extract_text() for page in reader.pages]

all_text = normalize_text(''.join(texts))


frequency = {medicine: all_text.count(m) for medicine, m in zip(medicine_list, norm_med_list)}

target = max(frequency.values())

medicines_prescribed = [medicine for medicine, freq in frequency.items() if freq == target]
print('New Medicines to Prescribe:', medicines_prescribed )
# %%
