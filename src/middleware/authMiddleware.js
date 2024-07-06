const jwt =require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

const authMiddleware = async (req, res ,next) => {
    try {
        const token = req.headers.token;
        if(!token) {
            return res.status(405).send({messsage: "Token is required"})
        }

        const verifyToken = jwt.verify(token , SECRET_KEY);
        if(!verifyToken) {
            return res.status(405).send("Token is incorrect")
        }

        if(verifyToken.role = "admin"){
            req.isAdmin = true
        }
        req.user = verifyToken;
        next()
    } catch (error) {
        return res.status(503).send({message: error.message})
    }
    
}

module.exports = authMiddleware