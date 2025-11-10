import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

type User = {
  id: string,
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

function sendResponse(res: ServerResponse, statusCode: number, data: unknown) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export function userRouter(req: IncomingMessage, res: ServerResponse) {
  const url = req.url;
  const method = req.method;

  // GET USERS
  if (url === '/api/users' && method === 'GET') {
    sendResponse(res, 200, users);
    return;
  }

  // GET USER
  if (url?.startsWith('/api/users/') && method === 'GET') {
    const userId = url.split('/')[3];

    if (!uuidValidate(userId)) {
      sendResponse(res, 400, { message: 'Invalid user ID' });
      return
    }

    const user = users.find(user => user.id === userId);

    if (!user) {
      sendResponse(res, 404, { message: 'User with this ID doesn\'t exist' });
      return;
    }

    sendResponse(res, 200, user);
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
          sendResponse(res, 400, { message: 'Missing required fields'});
          return;
        }

        const newUser: User = {
          id: uuidv4(),
          username,
          age,
          hobbies,
        }

        users.push(newUser);

        sendResponse(res, 201, newUser);
      } catch {
        sendResponse(res, 400, { message: 'Invalid JSON'});
      }
    })
    
    return;
  }

  // PUT USER
  if (url?.startsWith('/api/users/') && method === 'PUT') {
    const userId = url.split('/')[3];

    if (!uuidValidate(userId)) {
      sendResponse(res, 400, { message: 'Invalid user ID' });
      return;
    }

    let body = '';
    req.on('data', chunk => {
      body += chunk;
    })

    req.on('end', () => {
      try {
        const updatedData = JSON.parse(body);

        if (
          (updatedData.username && typeof updatedData.username !== 'string') ||
          (updatedData.age && typeof updatedData.age !== 'number') ||
          (updatedData.hobbies && !Array.isArray(updatedData.hobbies))
        ) {
          sendResponse(res, 400, { message: 'Invalid fields' });
          return;
        }

        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
          sendResponse(res, 404, { message: 'User with this ID doesn\'t exist' });
          return;
        }

        users[userIndex] = { ...users[userIndex], ...updatedData };

        sendResponse(res, 200, users[userIndex]);
      } catch {
        sendResponse(res, 400, { message: 'Invalid JSON' });
      }
    })

    return;
  }
  
  sendResponse(res, 404, { message: 'Route not found' });
}