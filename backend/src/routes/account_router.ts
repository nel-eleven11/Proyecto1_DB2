// routes/account.routes.ts
import { Router } from 'express';
import { create_account } from '../controllers/accounts/create_account';
import { fetch_all_accounts } from '../controllers/accounts/fetch_accounts';
import { fetch_account_by_id } from '../controllers/accounts/fetch_account_by_id';
import { update_account } from '../controllers/accounts/update_account';
import { delete_account } from '../controllers/accounts/delete_account';

// Additional
import { lock_account } from '../controllers/accounts/lock_account';
import { freeze_account } from '../controllers/accounts/freeze_account';
import { unlock_account } from '../controllers/accounts/unlock_account';

const account_router = Router();

account_router.post('/', create_account);
account_router.get('/', fetch_all_accounts);
account_router.get('/:id_cuenta', fetch_account_by_id);
account_router.put('/:id_cuenta', update_account);
account_router.delete('/:id_cuenta', delete_account);

account_router.put('/:id_cuenta/lock', lock_account);
account_router.put('/:id_cuenta/freeze', freeze_account);
account_router.put('/:id_cuenta/unlock', unlock_account);

export default account_router;

