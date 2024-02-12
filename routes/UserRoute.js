import express from 'express';
import {
    deleteUser,
    followUser,
    getAllUser,
    getUser,
    unFollowUser,
    updateUser
} from '../controllers/Usercontroller.js';

const router = express.Router();

router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/:id', getUser);
router.get('/', getAllUser);
router.put('/:id/follow', followUser);
router.put('/:id/unfollow', unFollowUser);

export default router