import express from 'express';

import { requestPasswordReset, resetPassword } from '../config/password.js';

const router = express.Router();

router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;