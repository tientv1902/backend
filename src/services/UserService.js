const User = require("../models/UserModel")
const { gennerralAccessToken } = require("./JwtService");
const bcrypt = require("bcrypt")

const createUser = (newUser) =>{
    return new Promise( async (resolve, reject) =>{
        const { name, email, password, confirmPassword, phone } = newUser
        try{
            const checkUser = await User.findOne({
                email: email
            })
            if(checkUser !== null){
                resolve({
                    status: 'ok',
                    message: "The email is alredy"
                })
            }
            const hash = bcrypt.hashSync(password, 10)
            console.log('hash', hash)
            const createUser = await User.create({
                name,
                email,
                password: hash,
                phone
            })
            if(createUser){
                resolve({
                    status: 'Ok',
                    message: 'Success',
                    data: createUser
                })
            }    
        }catch (e){
            reject(e)
        }
    })
}

const loginUser = (userLogin) =>{
    return new Promise( async (resolve, reject) =>{
        const { name, email, password, confirmPassword, phone } = userLogin
        try{
            const checkUser = await User.findOne({
                email: email
            })
            if(checkUser === null){
                resolve({
                    status: 'ok',
                    message: "The user is not defined"
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            console.log('comparepassword', comparePassword)
            if(!comparePassword){
                resolve({
                    status: 'Ok',
                    message: 'The password or user is  incorrect',
                    
                })
            }
            const access_token = await gennerralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })
            
            const refresh_token = await gennerralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })
            resolve({
                    status: 'Ok',
                    message: 'Success',
                    access_token,
                    refresh_token
                })
        }catch (e){
            reject(e)
        }
    })
}

module.exports = {
    createUser,
    loginUser
}