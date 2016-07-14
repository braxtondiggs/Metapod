'use strict';
import config from '../../config/environment';
var stripe = require('stripe')(config.stripe);
export function index(req, res) {
  var stripeToken = req.body.params.stripeToken;
  var user = req.body.params.user;
  stripe.customers.create({
    source: stripeToken,
    email: user.email,
    shipping: {
      address: {
        line1: user.address1,
        line2: user.address2,
        city: user.city,
        country: user.country,
        postal_code: user.zip,
        state: user.state
      },
      name: user.name
    }
  }).then(function(customer) {
    stripe.orders.create({
      currency: 'usd',
      customer: customer.id,
      email: user.email,
      shipping: {
        address: {
          line1: user.address1,
          line2: user.address2,
          city: user.city,
          country: user.country,
          postal_code: user.zip,
          state: user.state
        },
        name: user.name
      },
      items: req.body.params.items
    }, function(err, order) {
      if (err) {
        res.json(err);
      } else {
        stripe.orders.pay(order.id, {
          customer: customer.id
        }, function(err, pay) {
          if (err) {
            res.json(err);
          } else {
            res.json(pay);
          }
        });
      }
    });
  });
}
