import { Router } from 'express';
import { celebrate } from 'celebrate';
import { filterSalariesSchema } from './validation';
import { filterSalariesController } from './controller';

const router = Router();

router.get(
  '/salaries',
  celebrate({ query: filterSalariesSchema }),
  filterSalariesController
);

export default router;