The CPU monitor client is a React app that queries the [CPU monitor server](https://github.com/vgeyvandov/cpu-monitor-server) and visualizes the data over time. In the `cpu-monitor-client` directory, run `npm install && npm start` to set up and start the client. 

The client will run on `http://localhost:3000`.

The tests can be run via `npm test`. The client supports `eslint` commands via `npm run lint` and 
`npm run lint:fix`. The client also supports `prettier` via `npm run prettify`.

Once the app starts, it should first query for the number of CPUs on the local machine, and once it has a valid CPU value, it will start querying the service roughly every 10 seconds to get the latest average CPU load.


<img width="1757" alt="Screen Shot 2022-03-09 at 1 05 32 PM" src="https://user-images.githubusercontent.com/15752075/157440371-242d1ccb-918c-42ec-ac00-d845e0b8e6a4.png">
<img width="1757" alt="Screen Shot 2022-03-09 at 1 12 12 PM" src="https://user-images.githubusercontent.com/15752075/157440378-21579064-011e-44a4-929a-f29e5e876035.png">
