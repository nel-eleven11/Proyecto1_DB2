// src/routes/transaction.routes.ts
import { Router } from 'express';

import { fetch_all_transactions } from '../controllers/transactions/fetch_transactions';
import { create_transaction } from '../controllers/transactions/create_transaction';
import { fetch_transaction_by_id } from '../controllers/transactions/fetch_transaction_by_id';
import { update_transaction } from '../controllers/transactions/update_transaction';
import { delete_transaction } from '../controllers/transactions/delete_transaction';
import { fetch_fraudulent_transactions } from '../controllers/transactions/fetch_fraudulent_transactions';
import { fetch_transactions_by_account } from '../controllers/transactions/fetch_transactions_by_account';

const transaction_router = Router();

transaction_router.post('/', create_transaction);
transaction_router.get('/fraud', fetch_fraudulent_transactions);
transaction_router.get('/fraud/:cardNumber', fetch_fraudulent_transactions);
transaction_router.get('/account/:id_cuenta', fetch_transactions_by_account)
transaction_router.get('/', fetch_all_transactions);
transaction_router.get('/:id_transaccion', fetch_transaction_by_id);
transaction_router.put('/:id_transaccion', update_transaction);
transaction_router.delete('/:id_transaccion', delete_transaction);


export default transaction_router;

