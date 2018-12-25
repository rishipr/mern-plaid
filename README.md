# mern-plaid

![Final App](https://i.postimg.cc/tJYRKQPR/mern-Plaid-Final.gif)
Full-stack banking web app built with [Plaid's API](https://plaid.com) and the MERN stack.

This project uses the following technologies:

- [React](https://reactjs.org) and [React Router](https://reacttraining.com/react-router/) for the frontend
- [Express](http://expressjs.com/) and [Node](https://nodejs.org/en/) for the backend
- [MongoDB](https://www.mongodb.com/) for the database
- [Redux](https://redux.js.org/basics/usagewithreact) for global state management
- [Plaid](https://plaid.com) for bank account linkage and transaction data

## Medium Post

- [Build a Full Stack Banking Web App with Plaid & the MERN Stack](https://medium.com/@rishipr/build-a-fullstack-banking-web-app-with-plaid-the-mern-stack-508914ce5694)

## Configuration

### Mongo

Make sure to add your own `MONGOURI` from your [mLab](https://mlab.com) database in `config/keys.js`.

```javascript
module.exports = {
  mongoURI: "YOUR_MONGO_URI_HERE",
  secretOrKey: "secret"
};
```

### Plaid

Also, add your own [Plaid API](https://plaid.com) keys (`PLAID_CLIENT_ID`, `PLAID_SECRET`, and `PLAID_PUBLIC_KEY`) in

1. `routes/api/plaid.js`

```
const PLAID_CLIENT_ID = "YOUR_CLIENT_ID";
const PLAID_SECRET = "YOUR_SECRET";
const PLAID_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
```

2. `client/src/components/dashboard/Dashboard.js` and `client/src/components/dashboard/Accounts.js`

```
<PlaidLinkButton
                buttonProps={{
                  className:
                    "btn btn-large waves-effect waves-light hoverable blue accent-3 main-btn"
                }}
                plaidLinkProps={{
                  clientName: "YOUR_APP_NAME",
                  key: "YOUR_PUBLIC_KEY",
                  env: "sandbox",
                  product: ["transactions"],
                  onSuccess: this.handleOnSuccess
                }}
                onScriptLoad={() => this.setState({ loaded: true })}
              >
                Link Account
              </PlaidLinkButton>
```

## Quick Start

```javascript
// Install dependencies for server & client
npm install && npm run client-install

// Run client & server with concurrently
npm run dev

// Server runs on http://localhost:5000 and client on http://localhost:3000
```
