import { ApolloServer, SchemaDirectiveVisitor } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";
import dotenv from "dotenv";

import {
  typeDefs,
  resolvers,
  FormatDateDirective,
  AuthenticationDirective,
  AuthorizationDirective,
  AuthorizeDriverDirective,
} from "./graphql";

// Load .env file contents
dotenv.config();

// configure directives
const directives = {
  formatDate: FormatDateDirective,
  authenticated: AuthenticationDirective,
  authorized: AuthorizationDirective,
  authorizeDriver: AuthorizeDriverDirective,
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
});
