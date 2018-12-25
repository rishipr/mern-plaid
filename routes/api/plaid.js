const express = require("express");
const plaid = require("plaid");
const router = express.Router();
const passport = require("passport");
const moment = require("moment");
const mongoose = require("mongoose");

// Load Account and User models
const Account = require("../../models/Account");
const User = require("../../models/User");

const PLAID_CLIENT_ID = "YOUR_CLIENT_ID";
const PLAID_SECRET = "YOUR_SECRET";
const PLAID_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

const client = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments.sandbox,
  { version: "2018-05-22" }
);

var PUBLIC_TOKEN = null;
var ACCESS_TOKEN = null;
var ITEM_ID = null;

// @route GET api/plaid/accounts
// @desc Get all accounts linked with plaid for a specific user
// @access Private
router.get(
  "/accounts",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Account.find({ userId: req.user.id })
      .then(accounts => res.json(accounts))
      .catch(err => console.log(err));
  }
);

// @route POST api/plaid/accounts/add
// @desc Trades public token for access token and stores credentials in database
// @access Private
router.post(
  "/accounts/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    PUBLIC_TOKEN = req.body.public_token;

    const userId = req.user.id;

    const institution = req.body.metadata.institution;
    const { name, institution_id } = institution;

    if (PUBLIC_TOKEN) {
      client
        .exchangePublicToken(PUBLIC_TOKEN)
        .then(exchangeResponse => {
          ACCESS_TOKEN = exchangeResponse.access_token;
          ITEM_ID = exchangeResponse.item_id;

          // Check if account already exists for specific user
          Account.findOne({
            userId: req.user.id,
            institutionId: institution_id
          })
            .then(account => {
              if (account) {
                console.log("Account already exists");
              } else {
                const newAccount = new Account({
                  userId: userId,
                  accessToken: ACCESS_TOKEN,
                  itemId: ITEM_ID,
                  institutionId: institution_id,
                  institutionName: name
                });

                newAccount.save().then(account => res.json(account));
              }
            })
            .catch(err => console.log(err)); // Mongo Error
        })
        .catch(err => console.log(err)); // Plaid Error
    }
  }
);

// @route DELETE api/plaid/accounts/:id
// @desc Delete account with given id
// @access Private
router.delete(
  "/accounts/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Account.findById(req.params.id).then(account => {
      // Delete account
      account.remove().then(() => res.json({ success: true }));
    });
  }
);

// @route POST api/plaid/accounts/transactions
// @desc Fetch transactions from past 30 days from all linked accounts
// @access Private
router.post(
  "/accounts/transactions",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const now = moment();
    const today = now.format("YYYY-MM-DD");
    const thirtyDaysAgo = now.subtract(30, "days").format("YYYY-MM-DD");

    let transactions = [];

    const accounts = req.body;

    if (accounts) {
      accounts.forEach(function(account) {
        ACCESS_TOKEN = account.accessToken;
        const institutionName = account.institutionName;

        client
          .getTransactions(ACCESS_TOKEN, thirtyDaysAgo, today)
          .then(response => {
            transactions.push({
              accountName: institutionName,
              transactions: response.transactions
            });

            if (transactions.length === accounts.length) {
              res.json(transactions);
            }
          })
          .catch(err => console.log(err));
      });
    }
  }
);

module.exports = router;
