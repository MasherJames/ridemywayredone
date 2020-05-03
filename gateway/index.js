import { ApolloServer } from "apollo-server";
import { ApolloGateway, RemoteGraphQLDataSource } from "@apollo/gateway";

/* custom RemoteGraphQLDataSource that allows us to modify the outgoing request
 with information from the Apollo Server context before it's sent*/

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    request.http.headers.set("user", context.user);
  }
}

// apollo gateway instance
const gateway = new ApolloGateway({
  serviceList: [
    { name: "authentication", url: "http://localhost:4001/graphql" },
    { name: "rides", url: "http://localhost:4002/graphql" },
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
});

server.listen().then(({ url }) => {
  console.log(`Server running on port ${url}`);
});
