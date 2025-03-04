// routes/card.routes.ts
import { Router } from 'express';
import { create_card } from '../controllers/cards/create_card';
import { fetch_all_cards } from '../controllers/cards/fetch_cards';
import { fetch_card_by_id } from '../controllers/cards/fetch_card_by_id';
import { update_card } from '../controllers/cards/update_card';
import { delete_card } from '../controllers/cards/delete_card';
import { fetch_cards_by_account } from '../controllers/cards/fetch_cards_by_account';

const card_router = Router();

card_router.post('/', create_card);
card_router.get('/', fetch_all_cards);
card_router.get('/:id_tarjeta', fetch_card_by_id);
card_router.get('/account/:id_cuenta', fetch_cards_by_account)
card_router.put('/:id_tarjeta', update_card);
card_router.delete('/:id_tarjeta', delete_card);

export default card_router;

