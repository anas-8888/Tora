const fs = require('fs');
const app = require('./app');
const https = require('https');
// const http = require('http');
const dotenv = require('dotenv');
const { mongoConnect } = require('./services/mongo');

dotenv.config();

const PORT = process.env.PORT || 8000;

const server = https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
}, app);

// const server = http.createServer(app);

async function startServer() {
    await mongoConnect();
    server.listen(PORT, () => {
        console.log(`listening on port ${PORT}...`);
    });
}

startServer();