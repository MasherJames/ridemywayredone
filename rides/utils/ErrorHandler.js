import {
  UserInputError,
  ApolloError,
  AuthenticationError,
} from "apollo-server";

class ErrorHandler {
  static authenticationError(msg) {
    throw new AuthenticationError(msg);
  }

  static userInputError(msg, errors) {
    throw new UserInputError(msg, errors);
  }

  static apolloError(msg, code) {
    throw new ApolloError(msg, code);
  }

  static generalError(msg) {
    throw new Error(msg);
  }
}

export default ErrorHandler;
