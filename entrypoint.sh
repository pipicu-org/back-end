mkdir -p logs
chmod 777 logsset -e
npm run migration:run
npm run start