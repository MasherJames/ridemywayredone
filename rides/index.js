import { ApolloServer } from "apollo-server-express";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers";

// Load .env file contents
dotenv.config();

// app instance
const app = express();
// app middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// apollo server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError(err) {
    // Format error if need be, else this can be omitted
    return err;
  },
});

server.applyMiddleware({ app, path: "/graphql" });

// port
const port = process.env.PORT || 4001;

app.listen({ port }, () => {
  console.log(`👉 Server running on port ${port}`);
});
