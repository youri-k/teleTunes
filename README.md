# teleTunes

## Setup:
https://github.com/philipphoberg/teleTunes/wiki/Setup-Dev-Env

## Commands:
### Run
`docker-compose up teletunes`

### Test
`docker-compose up teletunes_test`

or:
```
    docker-compose up -d
    docker-compose exec npm test
```

### Clear database
```
    docker-compose up -d
    docker-compose exec teletunes nodejs src/cleanDb.js
    docker-compose restart teletunes
```
