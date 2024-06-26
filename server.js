// server.js

const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const axios = require("axios");

const app = express();

// Create GraphQL schema
const schema = buildSchema(`
  type Query {
    users: [User]
    posts: [Post]
  }

  type User {
    id: Int
    name: String
    email: String
  }

  type Post {
    id: Int
    title: String
    body: String
    userId: Int
  }
`);

// Define resolvers
const root = {
  users: async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      return response.data;
    } catch (error) {
      throw new Error("Error fetching users");
    }
  },
  posts: async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );
      return response.data;
    } catch (error) {
      throw new Error("Error fetching posts");
    }
  },
};

// Set up GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Enable GraphiQL interface
  })
);

// Define REST endpoints
app.get("/users", async (req, res) => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

app.get("/posts", async (req, res) => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts" });
  }
});

// Start the server
app.listen(4000, () => console.log("Server running on http://localhost:4000"));
