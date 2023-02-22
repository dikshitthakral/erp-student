'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const properties = require('./config/properties');
const routes = require('./api/routes/index');
const cors = require("cors");
const mongoose = require("mongoose");

class Server {
  constructor() {
    this.app = null;
  }

  start() {
    this.app = express();
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    mongoose
    .connect(properties.DB)
    .then(() => {
        console.log("Database Connected");
        // Server Listen
        this.app.listen(properties.PORT, () => {
        console.log(`Server is running on ${properties.PORT} port.`);
    });
  })
  .catch((e) => {
    console.log(e);
  });
    this.app.use('/api/v1/', routes);
  }
}

let server = new Server();
server.start();