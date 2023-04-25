import json
import time
import pyautogui
import pyperclip
import platform

if (platform.system() == 'Darwin'):
    modifier = 'command'
    interval = 0.01
else:
    modifier = 'ctrl'
    interval = 0


text = {'text': ''}

while True:
    inp = input()
    if inp == "getText":
        try:
            with pyautogui.hold(['command']):
                pyautogui.press('c')
            text['text'] = pyperclip.paste()
        except:
            pass
        print(json.dumps(text))
