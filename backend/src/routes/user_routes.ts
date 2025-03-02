import { Router } from 'express';
import { create_user } from '../controllers/users/create_user';
import { fetch_all_users } from '../controllers/users/fetch_users';
import { fetch_user_by_id } from '../controllers/users/fetch_user_by_id';
import { update_user } from '../controllers/users/update_user';
import { delete_user } from '../controllers/users/delete_user';

const user_router = Router();

user_router.post('/', create_user);
user_router.get('/', fetch_all_users);
user_router.get('/:id_usuario', fetch_user_by_id);
user_router.put('/:id_usuario', update_user);
user_router.delete('/:id_usuario', delete_user);

export default user_router;

