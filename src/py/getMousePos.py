import json
import pyautogui

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

