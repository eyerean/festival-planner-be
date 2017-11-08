# Festival Planner App
_The backend part_

For the time being the official mongo database linked with this project is private, but you can run one in localhost and update the settings of the BE (details in the BE repo).

### Setup
Run a local mongo database.

Create a config.js file like this one:

```
module.exports = {
  'secret': 'your_secret_here',
  'database': 'mongodb://localhost/your_database'
};

```

Mongoose is set to connect to the database that is declared in the config.js file.


Run `yarn install` to install all dependencies.

Run `yarn start` to start the BE app.

Run `yarn run dev` to start the app in dev mode.

To login in the FE app you need a user. Run the BE app and navigate to `localhost:3030/setup`. This will create user with name **Jane Doe** and password **doepass**.

This project uses Express, Mongoose and has JWT authentication implemented.
