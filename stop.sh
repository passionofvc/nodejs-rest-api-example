ps aux | grep APP=rest-api | grep -v grep | awk '{ print "kill -9", $2 }' | sh

