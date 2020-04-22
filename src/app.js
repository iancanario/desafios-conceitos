const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryID(request, response, next) {
  const {id} = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error: 'Invalid repository ID'})
  }

  return next();
}

app.use('/repositories/:id', validateRepositoryID);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repositorie = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repository = repositories.find(repository => id === repository.id)

  if (!repository) {
    return response.status(400).json({error: 'Respositorie not found'})
  }


  repository.title = title,
  repository.url = url,
  repository.techs = techs

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => id === repositorie.id);

  if (repositorieIndex < 0) {
    return response.status(400).json({error: 'Respositorie not found'})
  }

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repository = repositories.find(repositorie => id === repositorie.id);

  if (!repository) {
    return response.status(400).json({error: 'Respositorie not found'})
  }

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
