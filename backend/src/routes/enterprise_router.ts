import { Router } from 'express';
import { create_enterprise } from '../controllers/enterprise/create_enterprise';
import { delete_enterprise } from '../controllers/enterprise/delete_enterprise';
import { fetch_all_enterprises } from '../controllers/enterprise/fetch_enterprises';
import { fetch_enterprise_by_id } from '../controllers/enterprise/fetch_enterprise_by_id';
import { update_enterprise } from '../controllers/enterprise/update_enterprise';

const enterprise_router = Router();

enterprise_router.post('/', create_enterprise);
enterprise_router.get('/', fetch_all_enterprises);
enterprise_router.get('/:id_empresa', fetch_enterprise_by_id);
enterprise_router.put('/:id_empresa', update_enterprise);
enterprise_router.delete('/:id_empresa', delete_enterprise);

export default enterprise_router;

