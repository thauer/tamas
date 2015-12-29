#!/usr/bin/env python

import unittest
import sys
import subprocess

from os.path import isfile
from logging.config import fileConfig

if isfile('logging.cnf'): fileConfig('logging.cnf')

class SubprocessValidationTests(unittest.TestCase):
  """ TestCase validating subprocess features
  """

  def setUp(self):
    self.assertEquals(sys.version_info.major, 2)
    self.assertEquals(sys.version_info.minor, 7)

  def testCallReturnsReturncode(self):
    """ Tests that subprocess.call() returns the returncode of the process
    """
    self.assertEquals(0, subprocess.call(["true"]))
    self.assertEquals(1, subprocess.call(["false"]))

  def testCheck_outputRunsCommandWithArgumentsReturnsStdoutAsBytestring(self):
    """ Tests that subprocess.check_output() returns the process' STDOUT
    """
    # given: A command with arguments, specified as an array
    command = ["echo", "-e", "Hello"]
    # when: Running the command using subprocess.check_output()
    output = subprocess.check_output(command)
    # then: The return is a byte string
    self.assertIsInstance(output, str)
    # and: The return value is the expected output
    self.assertEquals("Hello\n", output)

  def testCheck_outputThrowsExceptionForNonNullReturncode(self):
    """ Tests that subprocess.check_output() throws CalledProcessError.
    The exception is thrown when the returncode of the process is not 0 and 
    the thrown exception contains the output.
    """
    # when: Calling a process 'cat /nonexistent' which returns a non-zero error code
    # then: a subprocess.CalledProcessError is thrown
    with self.assertRaises(subprocess.CalledProcessError) as cm:
      subprocess.check_output(["cat", "/nonexistent"], stderr=subprocess.STDOUT)

    # and: The exception's returncode and output attributes are set accordingly
    self.assertEquals(1, cm.exception.returncode)
    self.assertEquals("cat: /nonexistent: No such file or directory\n", cm.exception.output)

if __name__ == '__main__':
  unittest.main(verbosity=2)

