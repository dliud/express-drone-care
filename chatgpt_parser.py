from chatgpt_wrapper import ChatGPT
#https://medium.com/geekculture/using-chatgpt-in-python-eeaed9847e72 using first method here
from collections import defaultdict
from tqdm import tqdm
from PyPDF2 import PdfReader
from coordinates import get_lat_long_alt
#return ch

DEBUG = False
VERBOSE = False
name_query = "If the patient's name is available print it in brackets. Otherwise, print 'NAME NOT AVAILABLE' in brackets. Respond in a single line with an answer of the form [****]."
test_query = "If any tests were ordered for the patient, list them in brackets, otherwise, print 'NO TESTS' in brackets. Respond in a single line with an answer of the form [****]."
medicine_query = "If any new prescriptions were ordered for the patient, list them in brackets. Otherwise, print 'NO PRESCRIPTIONS' in brackets. Respond in a single line with an answer of the form [****]."
address_query = "If the patient's address is available print it in brackets. Otherwise, print 'ADDRESS NOT AVAILABLE' in brackets. Respond in a single line with an answer of the form [****]."

query = {'name': name_query, 'tests': test_query, 'medicine': medicine_query, 'address': address_query}
    
def contains_list(text):
    if '[' in text:
        start_index = text.index('[')
        return ']' in text[start_index:]
    else:
        return False

def get_cleaned_ans(text):
    start_index = text.index('[')
    end_index = text.index(']', start_index)
    return text[start_index+1:start_index+end_index].replace('[', '').replace(']', '')

def main():
    precription_file = 'data/nathan_sti_test.pdf' #
    #precription_file = 'data/address_demo.pdf'
    
    if VERBOSE:
        print("Reading visit summary file: ", precription_file)
    reader = PdfReader(precription_file, strict=False)
    texts = [page.extract_text() for page in reader.pages]
    joint_text = "\n".join(texts)
    if DEBUG:
        print(joint_text)
    bot = ChatGPT()
    
    if VERBOSE:
        print('Querying ChatGPT to analyze file')
    answers = defaultdict(lambda: "")
    for key in tqdm(['start'] + list(query)):
        if key == 'start':
            summary_response = bot.ask(joint_text)
            if DEBUG:
                print(summary_response)
        else:
            while(not contains_list(answers[key])):
                answers[key] = bot.ask(query[key])
                if DEBUG:
                    print(answers[key])

    for key in query:
        print(f'{key.upper()}: {get_cleaned_ans(answers[key])}')
    
    if 'NOT' in get_cleaned_ans(answers[key]).upper():
        lat, long, alt = 0, 0, 0
    else:
        lat, long, alt = get_lat_long_alt(get_cleaned_ans(answers['address']))
    print(f'LATITUDE: {lat} LONGITUDE: {long} ALTITUDE (m): {alt}')
if __name__ == "__main__":
    main()