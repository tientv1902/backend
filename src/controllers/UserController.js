const UserService = require('../services/UserService')
const JwtService = require('../services/JwtService')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GG_CLIENT_ID);

const createUser = async (req, res) => {
    try{
        const{ name, email, password, confirmPassword, phone} = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if(!email || !password || !confirmPassword ){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required '
            })
        }else if(!isCheckEmail){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email '
            })
        }else if(password !== confirmPassword){
            return res.status(200).json({
                status: 'ERR',
                message: 'The password is equal confirmPassword '
            })
        }
        
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const googleLogin = async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GG_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        // Kiểm tra xem người dùng đã tồn tại chưa
        let user = await UserService.findOrCreateUser(payload);

        const access_token = await JwtService.genneralAccessToken({
            id: user.id,  
            isAdmin: user.isAdmin
        });
        
        const refresh_token = await JwtService.genneralRefreshToken({
            id: user.id, 
            isAdmin: user.isAdmin
        });

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            samesite: 'strict'
        });

        return res.status(200).json({
            status: 'OK',
            message: 'Login successful',
            access_token,
            user,
        });
    } catch (error) {
        console.error("Google login error:", error);  
        return res.status(500).json({
            status: 'ERR',
            message: 'Google login failed',
            error: error.message
        });
    }
};


const loginUser = async (req, res) => {
    try{
        const{ email, password} = req.body
        console.log('req.body')
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        console.log(email, password)
        if(!email || !password ){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required '
            })
        }else if(!isCheckEmail){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email '
            })
        }
        const response = await UserService.loginUser(req.body)
        const {refresh_token, ...newReponse} = response
        res.cookie('refresh_token', refresh_token), {
            httpOnly: true,
            secure: false,
            samesite: 'strict'
        }
        return res.status(200).json(newReponse)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const updateUser = async (req, res) => {
    try{
        const userId = req.params.id
        const data = req.body
        if(!userId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required '
            })
        }
        const response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const deleteUser = async (req, res) => {
    try{
        const userId = req.params.id
        if(!userId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required '
            })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}



const getAllUser = async (req, res) => {
    try{
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsUser = async (req, res) => {
    try{
        const userId = req.params.id
        if(!userId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required '
            })
        }
        const response = await UserService.getDetailsUser(userId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const refreshToken = async (req, res) => {
    console.log("req.cookies.refresh_token",req.cookies.refresh_token)
    try{
        const token = req.cookies.refresh_token
        if(!token){
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required '
            })
        }
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const logoutUser = async (req, res) => {
    console.log("req.cookies.refresh_token",req.cookies.refresh_token)
    try{
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'Logout Successfully'
        })
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logoutUser,
    googleLogin
}