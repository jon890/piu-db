gcloud functions deploy pumbility-ranking \
--project=piudb-393301 \
--gen2 \
--runtime=nodejs20 \
--region=asia-northeast3 \
--source=. \
--entry-point=pumbility_ranking \
--trigger-http \
--allow-unauthenticated