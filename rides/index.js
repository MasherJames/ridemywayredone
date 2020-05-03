import { ApolloServer, SchemaDirectiveVisitor } from "apollo-server-express";
import { buildFederatedSchema } from "@apollo/federation";
import express from "express";
import morgan from "morgan";
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

// Load .env file contents
dotenv.config();

// app instance
const app = express();
// app middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

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
});

server.applyMiddleware({ app, path: "/graphql" });

// port
const port = process.env.PORT || 4002;

app.listen({ port }, () => {
  console.log(`👉 Server running on port ${port}`);
});
