#cat csv/M_SHIKEN.csv | jq -c -Rn 'input  | split(",") as $head | inputs | split(",") | to_entries | map(.key = $head[.key]) | from_entries' > M_SHIKEN.json
#cat csv/T_SHIKEN_QUESTIONS.csv | jq -c -Rn 'input  | split(",") as $head | inputs | split(",") | to_entries | map(.key = $head[.key]) | from_entries' > T_SHIKEN_QUESTIONS.json
#cat csv/T_QUESTION_DETAIL.csv | jq -c -Rn 'input  | split(",") as $head | inputs | split(",") | to_entries | map(.key = $head[.key]) | from_entries' > T_QUESTION_DETAIL.json
cat csv/T_ANSWER_DETAIL.csv | jq -c -Rn 'input  | split(",") as $head | inputs | split(",") | to_entries | map(.key = $head[.key]) | from_entries' > T_ANSWER_DETAIL.json


