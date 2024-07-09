const jwt = require("jsonwebtoken");
const { userModel } = require("../modules/auth/user.model");
const createHttpError = require("http-errors");
require("dotenv").config();

const authGuard = async (req, res, next) => {
    try {
        const token = req?.cookies?.access_token;
        if (!token) throw new createHttpError.Unauthorized("Please login to access!");
        const data = jwt.verify(token, process.env.JWT_SECRET);
        if (typeof data === "object" && "userId" in data) {
            const user = await userModel.findById(data.userId);
            if (!user) throw new createHttpError.Unauthorized("Account Not found!");
            req.user = user;
            return next();
        }   
        throw new createHttpError.Unauthorized("Invalid token!");
    } catch (error) {
        next(error);
    }
};

module.exports = authGuard;