import { Router } from 'express';
import { create_device } from '../controllers/devices/create_device';
import { fetch_all_devices } from '../controllers/devices/fetch_devices';
import { fetch_device_by_id } from '../controllers/devices/fetch_device_by_id';
import { update_device } from '../controllers/devices/update_device';
import { delete_device } from '../controllers/devices/delete_device';

const device_router = Router();

device_router.post('/', create_device);
device_router.get('/', fetch_all_devices);
device_router.get('/:id_dispositivo', fetch_device_by_id);
device_router.put('/:id_dispositivo', update_device);
device_router.delete('/:id_dispositivo', delete_device);

export default device_router;

