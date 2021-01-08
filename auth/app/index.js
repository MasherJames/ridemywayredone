import { ApolloServer, SchemaDirectiveVisitor } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";
import dotenv from "dotenv";

import {
  typeDefs,
  resolvers,
  FormatDateDirective,
  AuthenticationDirective,
  AuthorizationDirective,
} from "./graphql";

// Load .env file contents
dotenv.config();

// directives
const directives = {
  formatDate: FormatDateDirective,
  authenticated: AuthenticationDirective,
  authorized: AuthorizationDirective,
};

//takes an array of GraphQL schema modules and returns a federation-ready schema
let schema = buildFederatedSchema([{ typeDefs, resolvers }]);
// Configure custom directives
SchemaDirectiveVisitor.visitSchemaDirectives(schema, directives);

// apollo server instance
const server = new ApolloServer({
  schema: schema,
  formatError(err) {
    // - Format error if need be
    // - log errors to another service in production
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
const port = process.env.PORT || 4001;

server.listen(port).then(({ url }) => {
  console.log(`👉  Server ready at ${url}`);
});
