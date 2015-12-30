#!/usr/bin/env python

""" Quota check on the NAS """

from pyvirtualdisplay import Display
from selenium import webdriver

display = Display(visible=0, size=(800, 600))
display.start()
driver = webdriver.Firefox()

driver.get("http://10.15.15.1/logincheck.lua")
driver.find_element_by_id("uiPass").send_keys('7777777777')
driver.find_element_by_id("uiSubmitLogin").submit()
driver.find_element_by_link_text('Internet').click()
driver.find_element_by_link_text('Filters').click()
elem = driver.find_element_by_xpath(
  "//tr[td/@title='Laptop-Bence-MBP']/td[@class='bar']/span")

print elem.get_attribute('title')

driver.quit()
display.stop()
