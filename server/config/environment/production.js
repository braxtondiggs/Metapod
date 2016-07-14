'use strict';

// Production specific configuration
// =================================
import config from '../../config/environment/shared';
module.exports = {
  // Server IP
  ip:     process.env.OPENSHIFT_NODEJS_IP ||
          process.env.IP ||
          undefined,

  // Server port
  port:   process.env.OPENSHIFT_NODEJS_PORT ||
          process.env.PORT ||
          8080,

  stripe: config.stripe.production
};
