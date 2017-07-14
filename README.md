# node-ws-server

Node websocket server

Handles websocket like a champ, communicates with Rails & stuff.

## Install

Piece of cake:

`yarn`

or

`npm install`

## Run

Required environment variables:

- `DATABASE_URL`: mysql database connector URL
- `HTTP_PORT`: port used by Rails to broadcast WS messages through this app
- `WS_PORT`: public port on which WS messages should be sent out and listened to

Run:

`npm run bstart-prod`

Example:

```
DATABASE_URL=mysql://username:password@localhost:6033/database?sslca=config/as-ca.pem HTTP_PORT=10045 WS_PORT=10035 npm run bstart-pro
```

