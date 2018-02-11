# teleTunes

## Setup:
https://github.com/philipphoberg/teleTunes/wiki/Setup-Dev-Env

copy `settings.js.template` to `settings.js` and insert your values

## Commands:
### Run
`docker-compose up teletunes`

### Clear database
```
    docker-compose up -d
    docker-compose exec teletunes nodejs src/cleanDb.js
    docker-compose restart teletunes
```

## API-Dokumentation
https://github.com/philipphoberg/teleTunes/wiki/BackendAPI---Dokumentation
