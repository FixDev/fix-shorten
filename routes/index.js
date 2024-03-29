import express from 'express';
import UrlContoller from '../controller/UrlController.js';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Helloo ini api');
});
router.get('/:urlId', UrlContoller.index);
router.post('/api/short', UrlContoller.short);
router.post('/api/short-custom', UrlContoller.shortWithCustomUrl);

export default router;
