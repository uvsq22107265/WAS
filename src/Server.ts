import * as dotenv from 'dotenv';
import app from './App';

dotenv.config();

const port = parseInt(process.env.PORT, 10);
app.debug = !!+process.env.DEBUG;

app.server.listen(port, '0.0.0.0', () => {
    console.info(`Le jeu est maintenant accessible sur http://localhost:${port}...`);
});
