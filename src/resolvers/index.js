const Query = require('./query');
const Mutation = require('./mutation');
const User = require('./user');
const Subscription = require('./subscription')

module.exports = {
  Query,
  Mutation,
  MutationResponse: {
    __resolveType(mutationResponse, context, info) {
      return null;
    }
  },
  User,
  Subscription
};
