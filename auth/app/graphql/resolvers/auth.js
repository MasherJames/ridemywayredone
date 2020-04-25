import AuthController from "../../controllers/auth";

export default {
  UserType: {
    DRIVER: 1,
    PASSENGER: 2,
  },
  Mutation: {
    registerUser: async (parent, { input }, context, info) => {
      const response = await AuthController.register(input);
      return response;
    },
    verifyEmail: async (parent, { input }, context, info) => {
      const response = AuthController.verifyEmail(input);
      return response;
    },
    verifyPhone: async (parent, { input }, context, info) => {
      const response = AuthController.verifyPhone(input);
      return response;
    },
    login: async (parent, { input }, context, info) => {
      const response = AuthController.login(input);
      return response;
    },
  },
  Query: {
    allUsers: async (parent, args, ctx, info) => {
      const response = await AuthController.fetchAllUsers();
      return response;
    },
    getUser: async (parent, { uuid }, ctx, info) => {
      const response = await AuthController.fetchUser(uuid);
      return response;
    },
  },
};
