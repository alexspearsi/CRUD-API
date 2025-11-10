import { IncomingMessage, ServerResponse } from 'http';

export function userRouter(req: IncomingMessage, res: ServerResponse) {
  res.write('hello');
  res.end();
}