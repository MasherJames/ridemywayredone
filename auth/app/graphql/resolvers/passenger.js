import PassengerController from "../../controllers/passenger";

export default {
  Mutation: {
    registerPassenger: async (parent, { input }, ctx, info) => {
      const response = await PassengerController.registerPassenger(
        input,
        ctx.user
      );
      return response;
    },
  },
  Passenger: {
    user: async (user) => {
      return user.getUser();
    },
    __resolveReference: async (reference) => {
      const response = await PassengerController.fetchPassenger(reference.uuid);
      return response;
    },
  },
};
