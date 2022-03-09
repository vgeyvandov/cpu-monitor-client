The client is a React app that queries the CPU monitor API and visualizes the data over time. In the `cpu-monitor-client` directory, run `npm install && npm start` to set up and start the client. 
The client will run on `http://localhost:3000`.

The tests can be run via `npm test`. The client supports `eslint` commands via `npm run lint` and 
`npm run lint:fix`. The client also supports `prettier` via `npm run prettify`.

Once the app starts, it should first query for the number of CPUs on the local machine, and once it has a valid CPU value, it will start querying the service roughly every 10 seconds to get the latest average CPU load.