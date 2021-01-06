import AuthController from "../../controllers/auth";

export default {
  UserType: {
    DRIVER: 1,
    PASSENGER: 2,
  },
  Mutation: {
    registerUser: async (_, { input }) => {
      const response = await AuthController.register(input);
      return response;
    },
    verifyEmail: async (_, { input }) => {
      const response = AuthController.verifyEmail(input);
      return response;
    },
    verifyPhone: async (_, { input }) => {
      const response = AuthController.verifyPhone(input);
      return response;
    },
    login: async (_, { input }) => {
      const response = AuthController.login(input);
      return response;
    },
  },
  Query: {
    allUsers: async () => {
      const response = await AuthController.fetchAllUsers();
      return response;
    },
    getUser: async (_, { uuid }) => {
      const response = await AuthController.fetchUser(uuid);
      return response;
    },
  },
};
