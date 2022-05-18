import json
import pyautogui

mousePos = {'x': 0, 'y': 0}
text = {'text': ''}

try:
    x, y = pyautogui.position()
    mousePos['x'] = x
    mousePos['y'] = y
except:
    pass
print(json.dumps(mousePos))
