import Usermodel from "../models/Usermodel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const signup = async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    const hashedpassword = await bcrypt.hash(req.body.password, salt)
    const user = new Usermodel({
        ...req.body,
        password: hashedpassword,
    })
    try {
        const savedUser = await user.save()
        res.status(200).json(savedUser)
    } catch (error) {
        res.status(500).json(error)
    }

}
export const login = async (req, res) => {
    try {
        const user = await Usermodel.findOne({
            email: req.body.email,
        })
        if (!user) {
            res.status(400).json("User not found")
        }
        const validpassword = await bcrypt.compare(req.body.password, user.password)
        if (!validpassword) {
            res.status(400).json("Invalid password")
        }
        const token = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_SECRET)
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: true,
            expiresIn: "1d"
        })
        const {
            password,
            ...others
        } = user._doc
        res.status(200).json({
            others,
            token
        })
    } catch (error) {
        res.status(500).json(error)
    }
}