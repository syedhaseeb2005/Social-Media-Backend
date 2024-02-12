import express from 'express';
import {
    addPost,
    deletePost,
    dislikePost,
    getPost,
    getTimelinePost,
    likePost,
    updatePost
} from '../controllers/Postcontroller.js';

const router = express.Router();

router.post('/', addPost)
router.put('/:id', updatePost)
router.delete('/:id', deletePost)
router.get('/:id', getPost)
router.get('/timeline/all', getTimelinePost)
router.put('/:id/like', likePost)
router.put('/:id/dislike', dislikePost)

export default router