#!/usr/bin/env python

import unittest
import sys

from os.path import isfile
from logging.config import fileConfig

if isfile('logging.cnf'): fileConfig('logging.cnf')

class UnittestValidationTests(unittest.TestCase):
  """ TestCase validating selected features of the unittest module
  """

  def testUnittestIsAvailableAndFunctional(self):
    pass

  def testBasicAssertMethodsPass(self):
    self.assertEqual(2, 2)
    self.assertEqual("a", "a")
    self.assertEqual([1,2,3], [1,2,3])

    self.assertNotEqual(2, 4)
    self.assertNotEqual("a", "abc")
    self.assertNotEqual([1,2,3], [1,3])

    self.assertTrue(True)
    self.assertFalse(False)

    x = 'foo'
    y = x
    z = 'bar'.replace('bar', 'foo')
    self.assertIs(x, y)
    self.assertIsNot(x, z)

    self.assertIsNone(None)
    self.assertIsNotNone(2)

    self.assertIn(3, [2,3])
    self.assertNotIn(4, [2,3])

    self.assertIsInstance(2, int)
    self.assertIsInstance("abc", str)
    self.assertIsInstance([1,2,3], list)
    self.assertIsInstance({'a':1, 'b':2}, dict)
    self.assertNotIsInstance(2, str)

  @unittest.expectedFailure
  def testAnnotatedExpectedFailureIsReportedAsExpected(self):
    self.fail("Generating Failure")

  @unittest.expectedFailure
  def testBasicAssertMethodsFail02(self):
    self.assertEqual(2, 3)

  @unittest.expectedFailure
  def testBasicAssertMethodsFail03(self):
    self.assertEqual("a", "b")

  @unittest.expectedFailure
  def testBasicAssertMethodsFail04(self):
    self.assertEqual([1,2,3], [2,3])


  @unittest.expectedFailure
  def testBasicAssertMethodsFail05(self):
    self.assertNotEqual(2, 2)

  @unittest.expectedFailure
  def testBasicAssertMethodsFail06(self):
    self.assertNotEqual("abc", "abc")

  @unittest.expectedFailure
  def testBasicAssertMethodsFail07(self):
    self.assertNotEqual([1,3], [1,3])


  @unittest.expectedFailure
  def testBasicAssertMethodsFail08(self):
    self.assertTrue(False)

  @unittest.expectedFailure
  def testBasicAssertMethodsFail09(self):
    self.assertFalse(True)


  @unittest.expectedFailure
  def testBasicAssertMethodsFail10(self):
    x = 'foo'
    y = x
    self.assertIsNot(x, y)

  @unittest.expectedFailure
  def testBasicAssertMethodsFail11(self):
    x = 'foo'
    z = 'bar'.replace('bar', 'foo')
    self.assertIs(x, z)

  @unittest.expectedFailure
  def testBasicAssertMethodsFail12(self):
    self.assertIsNone(2)

  @unittest.expectedFailure
  def testBasicAssertMethodsFail13(self):
    self.assertIsNotNone(None)


  @unittest.expectedFailure
  def testBasicAssertMethodsFail14(self):
    self.assertIn(3, [2,4])

  @unittest.expectedFailure
  def testBasicAssertMethodsFail15(self):
    self.assertNotIn(3, [2,3])


  @unittest.expectedFailure
  def testBasicAssertMethodsFail16(self):
    self.assertIsInstance(2, str)

  @unittest.expectedFailure
  def testBasicAssertMethodsFail17(self):
    self.assertIsInstance("abc", int)

  @unittest.expectedFailure
  def testBasicAssertMethodsFail18(self):
    self.assertIsInstance([1,2,3], int)

  @unittest.expectedFailure
  def testBasicAssertMethodsFail19(self):
    self.assertIsInstance({'a':1, 'b':2}, str)

  @unittest.expectedFailure
  def testBasicAssertMethodsFail20(self):
    self.assertNotIsInstance(2, int)

  def testAssertMethodsPass(self):
    self.assertRegexpMatches("Hello, World!", "o,\sW..ld")

  def testAssertRaisesPassWhenExceptionIsRaised(self):
    with self.assertRaises(Exception) as cm:
      raise NameError('TestMessage')
    self.assertEquals('TestMessage', cm.exception.message)

  @unittest.expectedFailure
  def testAssertRaisesFailWhenExceptionIsNotRaised(self):
    with self.assertRaises(Exception) as cm:
      pass

  @unittest.expectedFailure
  def testAssertRaisesFailWhenWrongExceptionIsRaised(self):
    with self.assertRaises(NameError) as cm:
      raise Exception('TestMessage')

if __name__ == '__main__':
  unittest.main(verbosity=2)
