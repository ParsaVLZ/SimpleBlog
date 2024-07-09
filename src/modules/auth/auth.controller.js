const autoBind = require("auto-bind");
const AuthService = require("./auth.service");

class AuthController {
    #service
    constructor() {
        autoBind(this)
        this.#service = new AuthService();
    }
    
    async signup(req, res, next){
        try {
            const { username, password } = req.body;
            await this.#service.signup({ username, password });
            return res.json({
                message: "Signup successful, please login to your account."
            });
        } catch (error) {
            next(error)
        }
    }
    async login(req, res, next){
        try {
            const { username, password } = req.body;
            const { token } = await this.#service.login({ username, password });
            res.cookie('access_token', token);
            return res.json({
                message: "Login successful"
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = {
    authController: new AuthController()
}