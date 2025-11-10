import { IncomingMessage, ServerResponse } from 'http';

const users = [
  {
    id: 1,
    username: 'Alex',
    age: 25,
    hobbies: ['drawing', 'basketball']
  },
  {
    id: 2,
    username: 'Maria',
    age: 30,
    hobbies: ['football']
  },
  {
    id: 3,
    username: 'John',
    age: 28,
    hobbies: ['swimming']
  },
  {
    id: 4,
    username: 'Anna',
    age: 22,
    hobbies: ['tennis']
  }
];

export function userRouter(req: IncomingMessage, res: ServerResponse) {
  const url = req.url;
  const method = req.method;

  if (url === '/api/users' && method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(users));
    return;
  }

  if (url?.startsWith('/api/users/') && method === 'GET') {
    const parts = url.split('/');
    const userID = Number(parts[3]);

    if (isNaN(userID)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Invalid data' }))
      return
    }

    const user = users.find(user => user.id === userID);
    console.log(user);

    if (!user) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ message: 'User with this ID doesn\'t exist' }))
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(user))
    return;
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'Route not found' }));
}