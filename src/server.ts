import { server, PORT } from './app.js';

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

