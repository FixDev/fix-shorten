import express from 'express';
import UrlContoller from '../controller/UrlController.js'
const router = express.Router();

router.get('/:urlId', UrlContoller.index);
router.post('/api/short', UrlContoller.short);

export default router;
