import { IncomingMessage, ServerResponse } from 'http';

const users = [
  {
    id: 1,
    name: 'Alex',
    age: 25,
    email: 'alex@example.com',
    isActive: true
  },
  {
    id: 2,
    name: 'Maria',
    age: 30,
    email: 'maria@example.com',
    isActive: false
  },
  {
    id: 3,
    name: 'John',
    age: 28,
    email: 'john@example.com',
    isActive: true
  },
  {
    id: 4,
    name: 'Anna',
    age: 22,
    email: 'anna@example.com',
    isActive: true
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

  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'Route not found' }));
}