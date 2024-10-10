const Product = require("../models/ProductModel")


const createProduct = (newProduct) =>{
    return new Promise( async (resolve, reject) =>{
        
        const{ name, image, type, price, countInStock, rating, description} = newProduct
        try{
            const checkProduct = await Product.findOne({
                name: name
            })
            if(checkProduct !== null){
                resolve({
                    status: 'ok',
                    message: "The name of product is alredy"
                })
            }
            
            const newProduct = await Product.create({
                name, image, type, price, countInStock, rating, description
            })
            if(newProduct){
                resolve({
                    status: 'Ok',
                    message: 'Success',
                    data: newProduct
                })
            }    
        }catch (e){
            reject(e)
        }
    })
}

const updateProduct = (id, data) =>{
    return new Promise( async (resolve, reject) =>{
        try{
            const checkProduct = await Product.findOne({
                _id: id
            })
            if(checkProduct === null){
                resolve({
                    status: 'ok',
                    message: "The user is not defined"
                })
            }
            const updatedProduct = await Product.findByIdAndUpdate(id, data, {new: true})
            resolve({
                    status: 'Ok',
                    message: 'Success',
                    data: updatedProduct
                })
        }catch (e){
            reject(e)
        }
    })
}

const deleteProduct = (id) =>{
    return new Promise( async (resolve, reject) =>{
        try{
            const checkProduct = await Product.findOne({
                _id: id
            })
            if(checkProduct === null){
                resolve({
                    status: 'ok',
                    message: "The Produc is not defined"
                })
            }
            await Product.findByIdAndDelete(id)
            resolve({
                    status: 'Ok',
                    message: 'Delete product Success',
                    
                })
        }catch (e){
            reject(e)
        }
    })
}

const getAllProduct = (limit = 1, page = 0) =>{
    return new Promise( async (resolve, reject) =>{
        try{
            const totalProduct = await Product.countDocuments()
            const allProduct = await Product.find().limit(limit).skip(page * limit)
            resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allProduct,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
        }catch (e){
            reject(e)
        }
    })
}

const getDetailsProduct = (id) =>{
    return new Promise( async (resolve, reject) =>{
        try{
            const product = await Product.findOne({
                _id: id
            })
            if(product === null){
                resolve({
                    status: 'ok',
                    message: "The product is not defined"
                })
            }
            resolve({
                    status: 'Ok',
                    message: 'Success',
                    data: product
                })
        }catch (e){
            reject(e)
        }
    })
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
}