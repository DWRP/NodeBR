## ---- postgres
docker run --name postgres -e POSTGRES_USER=dwrpardim -e POSTGRES_PASSWORD=Ncpijkpl-1 -e POSTGRES_DB=heroes -p 5432:5432 -d postgres

docker exec -it postgres /bin/bash

docker run --name adminer -p 8080:8080 --link postgres:postgres -d adminer

## ---- MongoDB
docker run --name mongodb -e MONGO_INITDB_ROOT_USERNAME=dwrpardim -e MONGO_INITDB_ROOT_PASSWORD=Ncpijkpl-1 -p 27317:27317 -d mongo:4

docker run --name mongoclient -e MONGO_URL="mongodb://dwrpardim:Ncpijkpl-1@mongodb:27017/admin" -p 3000:3000 --link mongodb:mongodb -d mongoclient/mongoclient

docker exec -it mongodb mongo --host localhost -u dwrpardim -p Ncpijkpl-1 --authenticationDatabase admin --eval "db.getSiblingDB('heroes').createUser({user:'dwrp', pwd:'Ncpijkpl-1',roles:[{role:'readWrite',db:'heroes'}]})"