import json
import pyautogui
d = {'x': 0, 'y': 0}
while True:
    inp = input()
    if inp == "getMousePos":
        try:
            x,y = pyautogui.position()
            d['x'] = x
            d['y'] = y
        except:
            pass
        print(json.dumps(d))