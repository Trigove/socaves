import { Router } from 'express';
import relationshipController from './relationship.controller';

const router = Router();

router.put('/:type/:parentID', relationshipController.update);

export default router;
