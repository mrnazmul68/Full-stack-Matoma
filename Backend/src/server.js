require('dotenv').config();

const app = require('./app');
const { startDBConnection } = require('./config/db');

const PORT = process.env.PORT || 10000;

function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`Backend server listening on port ${PORT}`);
    });

    startDBConnection();
  } catch (error) {
    console.error('Failed to start backend:', error.message);
    process.exit(1);
  }
}

startServer();
