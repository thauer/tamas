#!/usr/bin/env python
# -*- coding: UTF-8 -*-

""" Testing selenium capabilities.

In order to hide the browser window popping up, we use xvfb. You need to install the dependencies
with 

$ sudo apt-get install xvfb
$ pip install pyvirtualdisplay

"""

import unittest

from pyvirtualdisplay import Display
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

class SeleniumTests(unittest.TestCase):

  def setUp(self):
    self.display = Display(visible=0, size=(800, 600))
    self.display.start()
    self.driver = webdriver.Firefox()

  def testGoogleTitleIsGoogle(self):
    self.driver.get("http://www.google.com")
    self.assertEquals("Google", self.driver.title)

  def testElementIsFoundById(self):
    self.driver.get("http://www.google.com")
    elem = self.driver.find_element_by_id("hplogo")
    self.assertEquals('div', elem.tag_name)

  def testSearchingForPyconFindsResults(self):
    self.driver.get("http://www.python.org")
    self.assertIn("Python", self.driver.title)
    elem = self.driver.find_element_by_name("q")
    elem.send_keys("pycon")
    elem.send_keys(Keys.RETURN)
    self.assertNotIn("No results found.", self.driver.page_source)

  def tearDown(self):
    self.driver.quit()
    self.display.stop()

if __name__ == "__main__":
  unittest.main()