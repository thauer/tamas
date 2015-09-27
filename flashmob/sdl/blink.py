import sys
import sdl2
import sdl2.ext

class SoftwareRenderer(sdl2.ext.SoftwareSpriteRenderSystem):
  def __init__(self, window):
    super(SoftwareRenderer, self).__init__(window)

  def render(self, components):
    sdl2.ext.fill(self.surface, sdl2.ext.Color(0, 0, 0))
    super(SoftwareRenderer, self).render(components)

class Phone(sdl2.ext.Entity):
  def __init__(self, world, sprite, posx=0, posy=0):
    self.sprite = sprite
    self.sprite.position = posx, posy

class BlinkingSystem(sdl2.ext.Applicator):
  def __init__(self, minx, miny, maxx, maxy):
    super(BlinkingSystem, self).__init__()
    self.componenttypes = sdl2.ext.Sprite, sdl2.ext.Sprite

  def process(self, world, componentsets):
    pass

def run():
  sdl2.ext.init()
  window = sdl2.ext.Window("The Pong Game", size=(800, 600))
  window.show()

  world = sdl2.ext.World()

  blinking = BlinkingSystem(0, 0, 800, 600)
  spriterenderer = SoftwareRenderer(window)
  world.add_system(blinking)
  world.add_system(spriterenderer)

  factory = sdl2.ext.SpriteFactory(sdl2.ext.SOFTWARE)
  phone1 = factory.from_color(sdl2.ext.Color(255, 255, 255), size=(10, 10))
  phone1 = Phone(world, phone1, 100, 100)

  running = True
  while running:
    events = sdl2.ext.get_events()
    for event in events:
      if event.type == sdl2.SDL_QUIT:
        running = False
        break
    world.process()

if __name__ == "__main__":
  sys.exit(run())