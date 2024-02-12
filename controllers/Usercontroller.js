import Usermodel from "../models/Usermodel.js"
import bcrypt from 'bcrypt'

export const updateUser = async (req, res) => {
    if (req.body.userId === req.params.id || req.user.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (error) {
                return res.status(500).json(error)
            }
        }
        try {
            const updateUser = await Usermodel.findByIdAndUpdate(req.params.id, {
                $set: req.body
            })
            res.status(200).json(updateUser)
        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        return res.status(403).json("You can update only your account")
    }
}
export const deleteUser = async (req, res) => {
    if (req.body.userId === req.params.id || req.user.isAdmin) {
        try {
            await Usermodel.findByIdAndDelete(req.params.id)
            res.status(200).json("User has been deleted")
        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        return res.status(403).json("You can delete only your account")
    }

}
export const getUser = async (req, res) => {
    try {
        const user = await Usermodel.findById(req.params.id)
        const {
            password,
            updatedAt,
            ...other
        } = user._doc
        res.status(200).json(other)
    } catch (error) {
        return res.status(500).json(error)
    }
}
export const getAllUser = async (req, res) => {
    try {
        const user = await Usermodel.find()
    } catch (error) {
        res.status(500).json(error)
    }
}
export const followUser = async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await Usermodel.findById(req.params.id)
            const currentUser = await Usermodel.findById(req.body.userId)
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    $push: {
                        followers: req.body.userId
                    }
                })
                await currentUser.updateOne({
                    $push: {
                        followings: req.params.id
                    }
                })
                res.status(200).json("user has been followed!")
            } else {
                return res.status(404).json("you already follow this user")
            }
        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        res.status(403).json("You can't follow yourself")
    }
}
export const unFollowUser = async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await Usermodel.findById(req.params.id)
            const currentUser = await Usermodel.findById(req.body.userId)
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    $pull: {
                        followers: req.body.userId
                    }
                })
                await currentUser.updateOne({
                    $pull: {
                        followings: req.params.id
                    }
                })
                res.status(200).json("user has been unfollowed!")
            } else {
                return res.status(404).json("you follow this user")
            }
        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        res.status(403).json("You can't unfollow yourself")
    }
}