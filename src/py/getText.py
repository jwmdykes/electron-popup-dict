import json
import time
import pyautogui
import pyperclip
import platform

if (platform.system() == 'Darwin'):
    modifier = 'command'
else:
    modifier = 'ctrl'


text = {'text': ''}

while True:
    inp = input()
    if inp == "getText":
        try:
            pyautogui.hotkey(modifier, 'c')
            time.sleep(0.01)
            text['text'] = pyperclip.paste()
        except:
            pass
        print(json.dumps(text))
