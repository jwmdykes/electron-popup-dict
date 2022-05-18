import json
import time
import pyautogui
import pyperclip

text = {'text': ''}

while True:
    inp = input()
    if inp == "getText":
        try:
            pyautogui.hotkey('ctrl', 'c')
            time.sleep(0.01)
            text['text'] = pyperclip.paste()
        except:
            pass
        print(json.dumps(text))
