# relay / redux example

sample app using `relay` and `redux` together in one component,
storing relay data in `mongodb` as a bonus

## developing

ensure you have mongodb running

if at any time you make changes to `data/schema.js`, stop the server,
regenerate `data/schema.json`, and restart the server:

```
npm install
npm run update-schema
npm start
```

## license
based on Relay Starter Kit (BSD licensed)
