import { ApolloServer, SchemaDirectiveVisitor } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";
import dotenv from "dotenv";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import {
  FormatDateDirective,
  AuthenticationDirective,
  AuthorizationDirective,
  AuthorizeDriverDirective,
  AuthorizePassengerDirective,
} from "./graphql/directives";

import models from "./db/models";
// Load .env file contents
dotenv.config();

// configure directives
const directives = {
  formatDate: FormatDateDirective,
  authenticated: AuthenticationDirective,
  authorized: AuthorizationDirective,
  authorizeDriver: AuthorizeDriverDirective,
  authorizePassenger: AuthorizePassengerDirective,
};

const schema = buildFederatedSchema([{ typeDefs, resolvers }]);

SchemaDirectiveVisitor.visitSchemaDirectives(schema, directives);

// apollo server instance
const server = new ApolloServer({
  schema: schema,
  formatError(err) {
    // Format error if need be, else this can be omitted
    return err;
  },
  context: ({ req }) => {
    if (req.headers.user) {
      const user = JSON.parse(req.headers.user);
      return { user };
    }
  },
});

// port
const port = process.env.PORT || 4002;

server.listen(port).then(({ url }) => {
  console.log(`👉  Server ready at ${url}`);
  // models.Car.destroy({ truncate: { cascade: true } });
  // models.Ride.destroy({ truncate: { cascade: true } });
});
