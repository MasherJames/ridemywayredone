import { ApolloServer } from "apollo-server";
import { ApolloGateway, RemoteGraphQLDataSource } from "@apollo/gateway";
import { getUser } from "./helpers";

/* custom RemoteGraphQLDataSource that allows us to modify the outgoing request
 with information from the Apollo Server context before it's sent*/

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    request.http.headers.set(
      "user",
      context.user ? JSON.stringify(context.user) : null
    );
  }
}

// apollo gateway instance
const gateway = new ApolloGateway({
  serviceList: [
    { name: "authentication", url: "http://localhost:4001" },
    { name: "rides", url: "http://localhost:4002" },
    { name: "requests", url: "http://localhost:8000/graphql/" },
  ],
  // enables us to customize the requests that are sent to our implementing services
  buildService({ name, url }) {
    return new AuthenticatedDataSource({ url });
  },
});

const server = new ApolloServer({
  gateway,
  // Disable subscriptions (not currently supported with ApolloGateway)
  subscriptions: false,
  context: ({ req }) => {
    if (req.headers.authorization) {
      // Grab the the token from the headers
      const token = req.headers.authorization;
      // get the user matching the token
      const user = getUser(token);
      if (!user) {
        throw new AuthenticationError("You must be logged in");
      }

      return { user };
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`Server running on port ${url}`);
});
