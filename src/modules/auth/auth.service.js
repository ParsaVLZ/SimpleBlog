const autoBind = require("auto-bind");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { userModel } = require("./user.model");

class AuthService {
    constructor() {
        autoBind(this)
    }

    async signup({ username, password }) {
        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            throw createError(400, "Username already exists!");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new userModel({ username, password: hashedPassword });
        await user.save();
        return user;
    }

    async login({ username, password }) {
        const user = await userModel.findOne({ username });
        if (!user) {
            throw createError(404, "User not found!");
        }
        const verifyPassword = await bcrypt.compare(password, user.password);
        if (!verifyPassword) {
            throw createError(401, "Invalid password!");
        }
        const token = this.signAccessToken(user._id);
        return { token };
    }

    signAccessToken(userId) {
        return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
    }

    verifyAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw createError(404, "Invalid token");
        }
    }
}

module.exports = AuthService;
