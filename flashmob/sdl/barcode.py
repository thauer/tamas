"""SDL Rectangle"""
import sys
import time
import sdl2
import sdl2.ext
import sdl2.events
import thread
import ctypes
    
barlength = 0.03 # In seconds
period = 3 # In seconds
squaresize = 10  # Size of square to blink
color0 = sdl2.ext.Color(0, 0, 0)
color1 = sdl2.ext.Color(200, 200, 200)

def raiseUserEvent(data1, data2):
  userevent = sdl2.events.SDL_UserEvent(type=sdl2.events.SDL_USEREVENT, 
                                        data1=data1, data2=data2)
  event = sdl2.events.SDL_Event(user=userevent)
  sdl2.events.SDL_PushEvent(ctypes.byref(event), 1)

def blinker(phoneid=0, pattern = [1,0]):
  """ Body of a thread which raises user events according to the given pattern
  with the phoneid stored in data1 and the on-off bit in data2, repeated every
  period time.
  """
  while True:
    for bit in pattern:
      raiseUserEvent(phoneid, bit)
      time.sleep(barlength)
    raiseUserEvent(phoneid, 0) # always switch off
    time.sleep(period - barlength * len(pattern))

def addphone(phones, phoneid, posx, posy, pattern):
  """ Adds a new phone to the dictionary 'phones' with the given id at the
  given position and pattern and starts blinking it
  """
  patternArray = []
  while pattern != 0:
    patternArray.insert(0, pattern & 1)
    pattern >>= 1
  phones[phoneid] = (posx, posy, squaresize, squaresize)
  thread.start_new_thread(blinker, (), {'phoneid': phoneid, 'pattern': patternArray})

def run(phones):
  sdl2.ext.init()
  window = sdl2.ext.Window("flashmob", size=(1920, 1200))
  window.show()
  window.maximize()
  sdl2.ext.fill(window.get_surface(), 0)
  window.refresh()

  running = True
  while running:
    events = sdl2.ext.get_events()
    for event in events:
      if event.type == sdl2.SDL_QUIT:
        running = False
      if event.type == sdl2.events.SDL_USEREVENT:
        if event.user.data2 == 1:
          sdl2.ext.fill(window.get_surface(), color1, phones[event.user.data1])
        else:
          sdl2.ext.fill(window.get_surface(), color0, phones[event.user.data1])

    window.refresh()
  sdl2.ext.quit()
  return 0

if __name__ == "__main__":
  phones = {}
  addphone(phones, 1,  300,  300, 0b110001100011000110001100011000110)
  addphone(phones, 2, 1500,  800, 0b110011001100110011001100110011001)
  addphone(phones, 3,  700,  500, 0b101001010110101011110101011010110)
  addphone(phones, 4, 1200, 1000, 0b101001010110101011110101011010110)

  sys.exit(run(phones))