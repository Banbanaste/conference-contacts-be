const pubsub = require('./pubsub')
const Subscription = {
    requestSent: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator(['REQUEST_SENT']) 
    },
  };

  module.exports = Subscription;