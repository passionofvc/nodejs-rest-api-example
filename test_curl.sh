#curl -s http://localhost:5000/api/shiken_kubuns | jq .
#curl -s "http://localhost:5000/api/shiken_days?shiken_kubun=AP" | jq .

shiken_day=$(echo "令和5年春期" | nkf -WMQ | tr = %)
echo ${shiken_day}

curl -s "http://localhost:5000/api/day_kubuns?shiken_kubun=AP&shiken_day=${shiken_day}" | jq .
