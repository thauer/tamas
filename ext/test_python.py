#!/usr/bin/env python
# -*- coding: UTF-8 -*-

"""Sample unittest to verify availability of python.

Run this in one of the following ways:

$ nose2 
$ nose2 test_python
$ nose2 test_python.PythonValidationTests
$ nose2 test_python.PythonValidationTests.testPythonIsAvailableAndFunctional
$ ./test_python.py

"""

import unittest
import sys
import logging

from os.path import isfile
from logging.config import fileConfig

__author__ = "Tamás Hauer"
__copyright__ = "Copyright 2015, Tamás Hauer"
__credits__ = ["Lilla Hauer"]
__license__ = "No particular license"
__version__ = "1.0.1"
__maintainer__ = "Tamás Hauer"
__email__ = "Tamas.Hauer@gmail.com"
__status__ = "Testing"

if isfile('logging.cnf'): fileConfig('logging.cnf')

class PythonValidationTests(unittest.TestCase):
  """ TestCase verifying the availability of the validated version of Python

  (Uses the sys module)
  """

  def setUp(self):
    self.logger = logging.getLogger(type(self).__name__)

  def testPythonIsAvailableAndFunctional(self):
    self.logger.info("Python is functional")

  def testPythonVersionIs2_7(self):
    self.assertEquals(sys.version_info.major, 2)
    self.assertEquals(sys.version_info.minor, 7)

if __name__ == '__main__':
  unittest.main(verbosity=2)
