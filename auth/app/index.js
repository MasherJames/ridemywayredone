import { ApolloServer, SchemaDirectiveVisitor } from "apollo-server-express";
import { buildFederatedSchema } from "@apollo/federation";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
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

// app instance
const app = express();
// app middleware
app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// directives
const directives = {
  formatDate: FormatDateDirective,
  authenticated: AuthenticationDirective,
  authorized: AuthorizationDirective,
};

const schema = buildFederatedSchema([{ typeDefs, resolvers }]);

// Configure custom directives
SchemaDirectiveVisitor.visitSchemaDirectives(schema, directives);

// apollo server instance
const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  // schema: schema,
  formatError(err) {
    // Format error if need be, else this can be omitted
    console.log(err);
    return err;
  },
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

server.applyMiddleware({ app, path: "/graphql" });

// port
const port = process.env.PORT || 4001;

app.listen({ port }, () => {
  console.log(`👉 Server running on port ${port}`);
  // models.User.destroy({ truncate: { cascade: true } });
});
