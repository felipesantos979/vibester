import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/auth', authRoutes);

app.use(errorMiddleware);

export default app;
