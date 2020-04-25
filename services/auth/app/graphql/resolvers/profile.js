import ProfileController from "../../controllers/profile";
import AuthController from "../../controllers/auth";

export default {
  Mutation: {
    updateProfile: async (parent, { input }, ctx, info) => {
      const response = await ProfileController.updateProfile(input, ctx);
      return response;
    },
  },
  Profile: {
    user: async (parent, args, { user: { uuid } }, info) => {
      const response = await AuthController.fetchUser(uuid);
      return response;
    },
  },
};
