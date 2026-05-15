const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let projects = [
  {
    id: 1,
    title: "Smart Garden Game",
    category: "Full Stack",
    description: "Java AI game with plant prediction and route optimization.",
    image: "",
    github: "#",
    demo: "#"
  },
  {
    id: 2,
    title: "Personal Portfolio",
    category: "Frontend",
    description: "Animated responsive portfolio website.",
    image: "",
    github: "#",
    demo: "#"
  }
];

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.get("/api/projects", (req, res) => {
  res.json(projects);
});

app.post("/api/projects", (req, res) => {
  const newProject = {
    id: Date.now(),
    title: req.body.title,
    category: req.body.category,
    description: req.body.description,
    image: req.body.image,
    github: req.body.github,
    demo: req.body.demo
  };

  projects.push(newProject);

  res.status(201).json(newProject);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});