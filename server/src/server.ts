import express from 'express';

const app = express();
app.use(express.json());

// Rota: Endereço completo da requisição
// Recurso: Qual entidade estamos acessando do sistema

// GET: Buscar uma ou mais informações do back-end
// POST: Criar uma nova informação no back-end
// PUT: Atualizar uma informação existente no back-end
// DELETE: Remover uma informação do back-end

// Request Param: Parâmetros que vem na própria rota que identificam um recurso
// Query Param: Parâmetros que vem na própria rota geralmente opcionais para filtros, paginação
// Request Body: Parâmetros para criação/atualização de informação

const users = [
  'Isabela',
  'Yasmin',
  'Sueli',
  'David',
  'Marcus',
];

app.get('/users', (request, response) => {
  const search = String(request.query.search);
  const filteredUsers = search ? users.filter(user => user.includes(search)) : users;
  return response.json(filteredUsers);
});

app.get('/users/:id', (request, response) => {
  const id = Number(request.params.id);
  const user = users[id];
  return response.json(user);
});

app.post('/users', (request, response) => {
  const data = request.body;
  const {name, email} = data;
  const user = {
    name,
    email,
  };
  return response.json(user);
});

app.listen(3333);