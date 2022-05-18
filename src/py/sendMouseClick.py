import json
import datetime
from pynput import mouse

# start = datetime.datetime.now()
# end = datetime.datetime.now()


def on_click(x, y, button, pressed):
    # time_diff = (end-start).total_seconds() * 1000  # milliseconds

    if not pressed:  # detect mouse up events
        print('mouseClick', flush=True)


while True:
    inp = input("")
    if inp == "stop":
        exit(0)
    else:
        with mouse.Listener(
            on_click=on_click
        ) as listener:
            listener.join()
