#!/usr/bin/env python

import sys
import xmlrpclib
import gandi

def setIPForName(ipaddress, name="dream"):
  """ Sets the A-record for the name "dream" in the zone specified by gandi.zoneid
  """

  api=xmlrpclib.ServerProxy('https://rpc.gandi.net/xmlrpc/')
  version = api.domain.zone.version.new(gandi.apikey, gandi.zoneid)
  api.domain.zone.record.delete(gandi.apikey, gandi.zoneid, version, {"type" : "A", "name": name})
  api.domain.zone.record.add(gandi.apikey, gandi.zoneid, version, 
    {"type" : "A", "name": name, "value": ipaddress, "ttl": 300 })
  api.domain.zone.version.set(gandi.apikey, gandi.zoneid, version)

if len(sys.argv) == 2:
  setIPForName(sys.argv[1])
elif len(sys.argv) == 3:
  setIPForName(sys.argv[1], name=sys.argv[2])
else:
  print "Usage: setdream.py <ipaddress> [name]"
