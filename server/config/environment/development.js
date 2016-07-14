'use strict';

// Development specific configuration
// ==================================
import config from '../../config/environment/shared';
module.exports = {

  // Seed database on startup
  seedDB: true,
  stripe: config.stripe.testing
};
