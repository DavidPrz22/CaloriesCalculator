import 'dotenv/config';
import express from 'express';
import cors from "cors";
import { ORIGINS_ALLOWED } from './constants';
import { getAppRoutes } from './routes';
const app = express();
const PORT = process.env.PORT || 3000;
app.set('trust proxy', 1);
app.use(cors({
    origin: ORIGINS_ALLOWED,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(getAppRoutes());
// Logger middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    });
    next();
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map