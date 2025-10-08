#!/bin/sh
mkdir -p logs
echo "Ejecutando migraciones..."
npm run migration:run
echo "Iniciando aplicacion..."
npm run start