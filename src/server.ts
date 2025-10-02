import app from './app';
import config from './config/config';
import { initializeDataSource } from './config/initializeDatabase';

(async () => {
  await initializeDataSource();

  app.listen(config.port, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║              🍔​ PIPI CUCU 🍔​                           ║
║         RESTAURANT API SERVER                          ║
║                                                        ║
║  🚀 Server running on port ${config.port}                        ║
║  📚 API Docs: http://localhost:${config.port}/api-docs           ║
║                                                        ║
║  🌟 Ready to serve delicious orders!                   ║
╚════════════════════════════════════════════════════════╝
    `);
  });
})();
