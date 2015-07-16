#!/usr/bin/env python

import sys
import xmlrpclib
import gandi_conf

def setIPForName(ipaddress, name="dream"):
  """ Sets the A-record for the name in the zone specified by gandi.zoneid
  """

  api=xmlrpclib.ServerProxy('https://rpc.gandi.net/xmlrpc/')
  version = api.domain.zone.version.new(gandi_conf.apikey, gandi_conf.zoneid)
  api.domain.zone.record.delete(gandi_conf.apikey, gandi_conf.zoneid, version, {"type" : "A", "name": name})
  api.domain.zone.record.add(gandi_conf.apikey, gandi_conf.zoneid, version, 
    {"type" : "A", "name": name, "value": ipaddress, "ttl": 300 })
  api.domain.zone.version.set(gandi_conf.apikey, gandi_conf.zoneid, version)

if len(sys.argv) == 2:
  setIPForName(sys.argv[1])
elif len(sys.argv) == 3:
  setIPForName(sys.argv[1], name=sys.argv[2])
else:
  print "Usage: gandi.py <ipaddress> [name]"
