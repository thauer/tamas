"""SDL Rectangle"""
import sys
from random import randint
from sdl2 import (SDL_QUIT, SDL_MOUSEBUTTONDOWN, SDL_Color)
import sdl2.ext as sdl2ext

def draw_rects(surface, width, height):
  for k in range(15):
    x, y = randint(0, width), randint(0, height)
    w, h = randint(1, width // 2), randint(1, height // 2)
    color = sdl2ext.Color(randint(0, 255), randint(0, 255), randint(0, 255))
    sdl2ext.fill(surface, color, (x, y, w, h))
    
def run():
  sdl2ext.init()
  window = sdl2ext.Window("2D drawing primitives", size=(800, 600))
  window.show()
  surface = window.get_surface()

  sdl2ext.fill(surface, 0)
  sdl2ext.fill(surface, sdl2ext.Color(100,200,0), (100,100,200,200))
  
  running = True
  while running:
    events = sdl2ext.get_events()
    for event in events:
      if event.type == SDL_MOUSEBUTTONDOWN:
        draw_rects(surface, 800, 600)
      if event.type == SDL_QUIT:
        running = False
    window.refresh()
  sdl2ext.quit()
  return 0

if __name__ == "__main__":
  sys.exit(run())