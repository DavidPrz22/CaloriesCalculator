const devOrigins = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5174',
        'http://localhost:5175',
        'http://127.0.0.1:5175',
        'http://localhost:80',
        'http://localhost',
];

const clientOrigin = process.env.CLIENT_ORIGIN;

export const ORIGINS_ALLOWED = clientOrigin
        ? [...devOrigins, clientOrigin]
        : devOrigins;