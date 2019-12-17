const User = {
  profile({ id }, args, { dataSources: { prisma } }, info) {
    return prisma.user({ id }).profile();
  },
  recievedRequests({ id }, args, { dataSources: { prisma } }) {
    return prisma.user({ id }).recievedRequests();
  },
  sentRequests({ id }, args, { dataSources: { prisma } }) {
    return prisma.user({ id }).sentRequests();
  }
};

module.exports = User;
