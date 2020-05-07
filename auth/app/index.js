import { ApolloServer, SchemaDirectiveVisitor } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";
import dotenv from "dotenv";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import {
  FormatDateDirective,
  AuthenticationDirective,
  AuthorizationDirective,
} from "./graphql/directives";
import models from "./db/models";

// Load .env file contents
dotenv.config();

// directives
const directives = {
  formatDate: FormatDateDirective,
  authenticated: AuthenticationDirective,
  authorized: AuthorizationDirective,
};

let schema = buildFederatedSchema([{ typeDefs, resolvers }]);
// Configure custom directives
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
const port = process.env.PORT || 4001;

server.listen(port).then(({ url }) => {
  console.log(`👉  Server ready at ${url}`);
  // models.Driver.destroy({ truncate: { cascade: true } });
  // models.Passenger.destroy({ truncate: { cascade: true } });
  // models.User.destroy({ truncate: { cascade: true } });
});
