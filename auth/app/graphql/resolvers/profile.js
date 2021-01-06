import ProfileController from "../../controllers/profile";
import AuthController from "../../controllers/auth";

export default {
  Mutation: {
    updateProfile: async (_, { input }, ctx) => {
      const response = await ProfileController.updateProfile(input, ctx);
      return response;
    },
  },
  Profile: {
    user: async (_, _, { user: { uuid } }) => {
      const response = await AuthController.fetchUser(uuid);
      return response;
    },
  },
};
