#curl -s http://localhost:5000/api/get_shiken_kubuns | jq .
#curl -s "http://localhost:5000/api/get_shiken_days?shiken_kubun=AP" | jq .

#shiken_day=$(echo "令和5年春期" | nkf -WMQ | tr = %)
#echo ${shiken_day}
curl -s "http://localhost:5000/api/get_shiken_day_kubuns?shiken_kubun=AP&shiken_day=2023/04/16" | jq .

day_kubun=$(echo "午前" | nkf -WMQ | tr = %)
curl -s "http://localhost:5000/api/get_one_question?shiken_kubun=AP&shiken_day=2023/04/16&day_kubun=${day_kubun}&que_no=1" | jq .
