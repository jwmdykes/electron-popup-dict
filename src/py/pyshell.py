import json
import time
import pyautogui
import pyperclip

mousePos = {'x': 0, 'y': 0}
text = {'text': ''}

while True:
    inp = input()
    if inp == "getMousePos":
        try:
            x,y = pyautogui.position()
            mousePos['x'] = x
            mousePos['y'] = y
        except:
            pass
        print(json.dumps(mousePos))
    elif inp == "getText":
        try:
            pyautogui.hotkey('ctrl', 'c')
            time.sleep(0.01)
            text['text'] = pyperclip.paste()
        except:
            pass
        print(json.dumps(text))
