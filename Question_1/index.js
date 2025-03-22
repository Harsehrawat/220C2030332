const express = require("express");
const app = express();
require("dotenv").config();


// i was getting invalid authorization whenever trying to fetch any response from the /test server even i had Authorization and token all correct and at right place

const users = [
  { id: 1, name: "Harsh", posts: 10 },
  { id: 2, name: "Uday", posts: 15 },
  { id: 3, name: "Harshad", posts: 8 },
  { id: 4, name: "Vikram", posts: 20 },
  { id: 5, name: "Bansal", posts: 25 },
  { id: 6, name: "Anshul", posts: 18 },
];

const posts = [
  { id: 1, title: "First Post", comments: 5, createdAt: new Date("2024-03-10") },
  { id: 2, title: "Second Post", comments: 8, createdAt: new Date("2024-03-15") },
  { id: 3, title: "Third Post", comments: 15, createdAt: new Date("2024-03-20") },
  { id: 4, title: "Fourth Post", comments: 3, createdAt: new Date("2024-03-22") },
  { id: 5, title: "Fifth Post", comments: 10, createdAt: new Date("2024-03-25") },
];

app.get("/users", (req, res) => { // sorting top user based on post and pagination of 5 top suers
  const topUsers = users.sort((a, b) => b.posts - a.posts).slice(0, 5);
  res.json(topUsers);
});

app.get("/posts", (req, res) => {
  const { type } = req.query;
    // poplular based on comments 
  if (type === "popular") {
    const maxComments = Math.max(...posts.map((post) => post.comments));
    const popularPosts = posts.filter((post) => post.comments === maxComments);
    return res.json(popularPosts);
  }
  // sorting based on newest first and pagination of 5 top lastest posts
  if (type === "latest") {
    const latestPosts = posts.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
    return res.json(latestPosts);
  }

  return res.status(400).json({ error: "Invalid query parameter" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
