"""SDL Rectangle"""
import sys
from time import sleep
from sdl2 import (SDL_QUIT, SDL_MOUSEBUTTONDOWN, SDL_Color)
import sdl2.ext as sdl2ext

def draw_rects(surface, width, height):
  for k in range(15):
    x, y = randint(0, width), randint(0, height)
    w, h = randint(1, width // 2), randint(1, height // 2)
    color = sdl2ext.Color(randint(0, 255), randint(0, 255), randint(0, 255))
    sdl2ext.fill(surface, color, (x, y, w, h))
    
barlength = 0.01 # In seconds
squaresize = 10  # Size of square to blink
color0 = sdl2ext.Color(0, 0, 0)
color1 = sdl2ext.Color(200, 200, 200)

def emitCode( pattern, window, x, y ):
  """ Emits the code specified in pattern (expects array of ints) in the given window,
  at the given (x, y) position
  """
  for bit in pattern:
    if bit == 0:
      color = color0
    else:
      color = color1

    sdl2ext.fill(window.get_surface(), color, (x, y, squaresize, squaresize))
    sleep(barlength)
    window.refresh()

def run():
  sdl2ext.init()
  window = sdl2ext.Window("flashmob", size=(800, 600))
  window.show()

  sdl2ext.fill(window.get_surface(), 0)
  window.refresh()

  running = True
  while running:
    events = sdl2ext.get_events()
    for event in events:
      if event.type == SDL_QUIT:
        running = False
    emitCode([1,0,0,1,0,0,1,1,1,0,0,1,0,1,0], window, 100, 100)
    sleep(5)
    window.refresh()
  sdl2ext.quit()
  return 0

if __name__ == "__main__":
  sys.exit(run())