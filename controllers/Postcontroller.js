import Postmodel from "../models/Postmodel.js";
import Usermodel from "../models/Usermodel.js";

export const addPost = async (req, res) => {
    try {
        const post = new Postmodel(req.body)
        const savedPost = await post.save()
        res.status(200).json(savedPost)
    } catch (error) {
        res.status(500).json(error)
    }
}
export const updatePost = async (req, res) => {
    try {
        const post = await Postmodel.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.updateOne({
                $set: req.body
            })
            res.status(200).json("Post Updated")
        } else {
            return res.status(403).json("You can update only your post")
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}
export const deletePost = async (req, res) => {
    try {
        const post = await Postmodel.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.deleteOne()
            res.status(200).json("Post deleted")
        } else {
            return res.status(403).json("You can delete only your post")
        }

    } catch (error) {
        return res.status(500).json(error)
    }
}
export const getPost = async (req, res) => {
    try {
        const post = await Postmodel.findById(req.params.id)
        res.status(200).json(post)
    } catch (error) {
        return res.status(500).json(error)
    }
}
export const likePost = async (req, res) => {
    try {
        const post = await Postmodel.findById(req.params.id)
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({
                $push: {
                    likes: req.body.userId
                }
            })
            res.status(200).json("Post liked")
        } else {
            await post.updateOne({
                $pull: {
                    likes: req.body.userId
                }
            })
            res.status(200).json("Post unliked")
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}
export const dislikePost = async (req, res) => {}


export const getTimelinePost = async (req, res) => {
    try {
        const currentUser = await Usermodel.findById(req.body.userId);
        const userPosts = await Postmodel.find({
            userId: currentUser._id
        });
        const friendPost = await Promise.all(
            currentUser.followings.map(frientId => {
                return Postmodel.find({
                    userId: frientId
                })
            }))
        res.status(200).json(userPosts.concat(...friendPost))

    } catch (error) {
        return res.status(500).json(error)
    }
}