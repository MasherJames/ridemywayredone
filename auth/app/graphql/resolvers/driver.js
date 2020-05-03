import DriverController from "../../controllers/driver";

export default {
  Mutation: {
    registerDriver: async (parent, { input }, ctx, info) => {
      const response = await DriverController.registerDriver(input, ctx.user);
      return response;
    },
  },
  Driver: {
    user: async (user) => {
      return user.getUser();
    },
    __resolveReference: async (reference) => {
      const response = await DriverController.fetchDriver(reference.uuid);
      return response;
    },
  },
};
