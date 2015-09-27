import sys
import sdl2.ext
import time

sdl2.ext.init()

window = sdl2.ext.Window("Hello World!", size=(640, 480))
window.show()

time.sleep(3)