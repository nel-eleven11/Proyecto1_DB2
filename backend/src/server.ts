import type { Express } from "express";
import express from "express";
import { json } from "express";
import helmet from 'helmet';
import cors from 'cors';
import bank_router from "./routes/bank_routes";
import user_router from "./routes/user_routes";
import enterprise_router from "./routes/enterprise_router";
import account_router from "./routes/account_router";
import card_router from "./routes/card_routes";
import device_router from "./routes/device_routes";
import transaction_router from "./routes/transaction_routes";
import { authMiddleware } from "./middleware/authMiddleware";
import auth_router from "./routes/auth_router";
import healthcheck_router from "./routes/healthcheck_router";

const PORT: number = process.env.RPPORT as unknown as number || 8080;
const HOST: string = process.env.RPHOST || "0.0.0.0";

const app: Express = express();


app.use(cors());
app.use(helmet());
app.use(json());

app.use('/api/v1/healthcheck', healthcheck_router)
app.use('/api/v1/auth', auth_router)
app.use('/api/v1/bank', authMiddleware, bank_router);
app.use('/api/v1/user', authMiddleware, user_router);
app.use('/api/v1/enterprise', authMiddleware, enterprise_router);
app.use('/api/v1/account', authMiddleware, account_router);
app.use('/api/v1/card', authMiddleware, card_router);
app.use('/api/v1/device', authMiddleware, device_router);
app.use('/api/v1/transaction', authMiddleware, transaction_router);

app.listen(PORT, HOST, () => {
    console.log(`Server up n' running on port ${HOST}:${PORT}`)
});

