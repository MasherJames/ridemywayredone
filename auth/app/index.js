import { ApolloServer, AuthenticationError } from "apollo-server-express";
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
import getUser from "./utils/getUser";

// Load .env file contents
dotenv.config();

// app instance
const app = express();
// app middleware
app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// apollo server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    formatDate: FormatDateDirective,
    authenticated: AuthenticationDirective,
    authorized: AuthorizationDirective,
  },
  formatError(err) {
    // Format error if need be, else this can be omitted
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
const port = process.env.PORT || 4000;

app.listen({ port }, () => {
  console.log(`👉 Server running on port ${port}`);
});
