import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

type User = {
  id?: string,
  username: string,
  age: number,
  hobbies: string[]
}

const users: User[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    username: 'Alex',
    age: 25,
    hobbies: ['drawing', 'basketball']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    username: 'Maria',
    age: 30,
    hobbies: ['football']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    username: 'John',
    age: 28,
    hobbies: ['swimming']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    username: 'Anna',
    age: 22,
    hobbies: ['tennis']
  }
];

export function userRouter(req: IncomingMessage, res: ServerResponse) {
  const url = req.url;
  const method = req.method;

  // GET
  if (url === '/api/users' && method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(users));
    return;
  }

  // GET USER
  if (url?.startsWith('/api/users/') && method === 'GET') {
    const parts = url.split('/');
    const userID = parts[3];

    if (!uuidValidate(userID)) {
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

  // POST USER
  if (url === '/api/users' && method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        const { username, age, hobbies } = data;

        if (
          typeof username !== 'string' ||
          typeof age !== 'number' ||
          !Array.isArray(hobbies)
        ) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'Missing required fields'}))
          return;
        }

        const newUser: User = {
          username,
          age,
          hobbies,
          id: uuidv4()
        }

        users.push(newUser);

        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(newUser));
      } catch {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: 'Invalid JSON'}))
      }
 
    })

    return;
  }



  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'Route not found' }));
}