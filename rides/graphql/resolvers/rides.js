import RideController from "../../controllers/ride";

export default {
  Mutation: {
    addRide: async (parent, { input }, { user: { uuid } }, info) => {
      const response = await RideController.addRide(input, uuid);
      return response;
    },
    amendRide: async (parent, { input, uuid }, ctx, info) => {
      const response = await RideController.amendRide(input, uuid);
      return response;
    },
  },
  Query: {
    allRides: async (parent, args, ctx, info) => {
      const response = await RideController.fetchAllRides();
      return response;
    },
    singleRide: async (parent, { uuid }, ctx, info) => {
      const response = await RideController.fetchRide(uuid);
      return response;
    },
  },
};
