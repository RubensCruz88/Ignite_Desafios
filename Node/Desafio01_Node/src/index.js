const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
	const {username} = request.headers;

	const user = users.find((user) => user.username == username);
  
	if(!user){
	  return response.status(404).json({error: "Usuario não encontrado"});
	}
	  
	request.user = user;

	return next();
  
  }

app.post('/users', (request, response) => {
	const {name, username} = request.body;

	if (users.find( user => user.username === username)){
		return response.status(400).json({error: "usuario ja existe"});
	}
	
	
	const user = {
		id: uuidv4(),
		name,
		username,
		todos: []
	}

	users.push(user);

	return response.json(user);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
	const { user } = request;

	return response.send(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
	const { user } = request;
	const {title, deadline} = request.body;

	const todos = {
		id: uuidv4(),
		title,
		done: false,
		deadline: new Date(deadline),
		created_at: new Date()
	}

	user.todos.push(todos);

	return response.status(201).json(todos);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
	const { user } = request;
	const { title, deadline } = request.body;
	const { id } = request.params;

	const todo = user.todos.find(todo => todo.id === id)

	if(!todo){
		return response.status(404).json({error: "todo não existe"});
	}

	todo.title = title;
	todo.deadline = deadline;

	return response.json(todo);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
	const { user } = request;
	const { id } = request.params;

	const todo = user.todos.find(todo => todo.id === id)

	if(!todo){
		return response.status(404).json({error: "tarefa não localizada"});
	}

	todo.done = true;

	return response.send(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
	const { user } = request;
	const { id } = request.params;

	const todo = user.todos.findIndex(todo => todo.id === id)

	if(todo < 0){
		return response.status(404).json({error: "tarefa não localizada"});
	}

	user.todos.splice(todo,1);

	return response.status(204).json(user);
});

module.exports = app;