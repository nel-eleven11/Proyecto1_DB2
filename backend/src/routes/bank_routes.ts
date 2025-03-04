import { create_bank } from "../controllers/banks/create_bank";
import { fetch_all_banks } from "../controllers/banks/fetch_banks";
import { fetch_bank_by_id } from "../controllers/banks/fetch_bank_by_id";
import { delete_bank } from "../controllers/banks/delete_bank";
import { update_bank } from "../controllers/banks/update_bank";

import { Router } from "express";

const bank_router = Router();

bank_router.post('/', create_bank);           
bank_router.get('/', fetch_all_banks);         
bank_router.get('/:id_banco', fetch_bank_by_id);
bank_router.put('/:id_banco', update_bank);   
bank_router.delete('/:id_banco', delete_bank); 

export default bank_router;
