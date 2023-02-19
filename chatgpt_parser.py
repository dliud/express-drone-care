from chatgpt_wrapper import ChatGPT
#https://medium.com/geekculture/using-chatgpt-in-python-eeaed9847e72 using first method here
from collections import defaultdict
from tqdm import tqdm
from PyPDF2 import PdfReader
from coordinates import get_lat_long_alt
#return ch

DEBUG = False
VERBOSE = False

launch_address = "550 Jane Stanford Way, Stanford, CA 94305"
context_query = 'I will input a medical document and then ask you questions about it. I want you to respond to the questions I will ask with an answer enclosed in brackets. For example, what is 2 + 2? [4] Who was the first US president? [George Washington]'

name_query = "What is the patient's name? If the name is not known, answer 'NAME NOT AVAILABLE'. Respond with an answer in brackets."
test_query = "What medical tests were ordered for the patient? If no tests were listed, answer 'NO TESTS'. Respond with an answer in brackets."
medicine_query = "What new prescriptions were ordered for the patient? If no prescriptions were ordered, answer 'NO PRESCRIPTIONS'. Respond with an answer in brackets."
address_query = "What is the patient's address. If the address is not available, answer 'ADDRESS NOT AVAILABLE'. Respond with an answer in brackets."

query = {'name': name_query, 'tests': test_query, 'medicine': medicine_query, 'delivery address': address_query}
    
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

def valid_answer(key, text):
    if not contains_list(text):
        return False
    elif key == 'delivery address':
        cleaned_ans = get_cleaned_ans(text)
        return cleaned_ans[0].isdigit() or 'ADDRESS NOT AVAILABLE' in cleaned_ans
    return True

def relogin_error_message(text):
    return 'Unusable response produced' in text

def main():
    #precription_file = 'data/address_demo.pdf' #
    precription_file = 'data/upload.pdf'
    
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
    for key in tqdm(['start0', 'start1'] + list(query)):
        if key == 'start0':
            r = bot.ask(context_query)
            if relogin_error_message(r):
                print('ERROR: RELOGING TO CHATGPT')
                return 
            if DEBUG:
                print(r)
        elif key == 'start1':
            summary_response = bot.ask(joint_text)
            if relogin_error_message(summary_response):
                print('ERROR: RELOGING TO CHATGPT')
                return 
            if DEBUG:
                print(summary_response)
        else:
            while(not valid_answer(key, answers[key])):
                answers[key] = bot.ask(query[key])
                if relogin_error_message(answers[key]):
                    print('ERROR: RELOGING TO CHATGPT')
                    return 
                if DEBUG:
                    print(answers[key])

    for key in query:
        print(f'{key.upper()}: {get_cleaned_ans(answers[key])}')
    
    delivery_address = get_cleaned_ans(answers['delivery address'])
    if 'NOT' in delivery_address.upper():
        lat, long, alt = 0, 0, 0
    else:
        lat, long, alt = get_lat_long_alt(delivery_address)
    print(f'DELIVERY INFO * LATITUDE: {lat} LONGITUDE: {long} ALTITUDE (m): {alt}')
    print(f'LAUNCH ADDRESS: {launch_address}')
    d_lat, d_long, d_alt = get_lat_long_alt(launch_address)
    print(f'LAUNCH INFO * LATITUDE: {d_lat} LONGITUDE: {d_long} ALTITUDE (m): {d_alt}')
    print(f"LANDING ALTITUDE ABOVE TAKEOFF (ATO) (m): {alt - d_alt})")
if __name__ == "__main__":
    main()