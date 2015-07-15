#!/usr/bin/python

import boto
import boto.ec2
import time

conn = boto.ec2.connect_to_region("us-west-2")
ami='ami-61414351'
subnet='subnet-9299eff7'
secgroup = 'sg-875899e3'
instance_type='g2.2xlarge'
 
instance = None

if False:
  resultSet = conn.request_spot_instances("0.3", ami, key_name='thauer_prodema', 
    instance_type=instance_type, subnet_id=subnet, security_group_ids=[secgroup])

  spotInstanceRequest = resultSet[0]
  print "Launched Spot Instance Request " + spotInstanceRequest.id

  for i in range(10):
    resultSet = conn.get_all_spot_instance_requests(request_ids=[spotInstanceRequest.id])
    spotInstanceRequest = resultSet[0]
    print(spotInstanceRequest.state + " / " + 
      spotInstanceRequest.status.code + " / " + spotInstanceRequest.status.message)
    if spotInstanceRequest.state == "fulfilled": break
    time.sleep(20)

  if spotInstanceRequest.instance_id != None:
    instance = conn.get_only_instances(instance_ids=[spotInstanceRequest.instance_id])[0]

else:
  reservation = conn.run_instances(ami, key_name='thauer_prodema',
    instance_type=instance_type, subnet_id=subnet, security_group_ids=[secgroup])
  instance = reservation.instances[0]

print("Reserved instance " + instance.id)
for i in range(10):
  print("..." + instance.state)
  if instance.state != "pending": break
  time.sleep(15)
  instance.update()

print "Started Instance " + instance.ip_address
