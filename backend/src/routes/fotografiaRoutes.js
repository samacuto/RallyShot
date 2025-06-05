import express from 'express'
import { requireAuth } from '../middlewares/requireAuth.js'
import { requireAdmin } from '../middlewares/requireAdmin.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import FotografiaController from '../controllers/FotografiaController.js'

const router = express.Router()

router.get('/gallery', FotografiaController.getGallery)

router.get('/gallery/:contestId', FotografiaController.getGalleryByContest)

router.patch(
  '/:id/status',
  verifyToken,
  requireAuth,
  requireAdmin,
  FotografiaController.updateStatus
)

router.get(
  '/pending',
  verifyToken,
  requireAuth,
  requireAdmin,
  FotografiaController.getPending
)

router.get('/:id/votes', FotografiaController.getVoteCount)

router.get('/ranking', FotografiaController.getRanking)

router.get('/ranking-global', FotografiaController.getRankingGlobal)

router.delete('/:id', verifyToken, requireAuth, FotografiaController.delete)

router.get(
  '/pending/:contestId',
  verifyToken,
  requireAuth,
  requireAdmin,
  FotografiaController.getPendingByContest
)

export default router
