const Product = require("../models/ProductModel")


const createProduct = (newProduct) =>{
    return new Promise( async (resolve, reject) =>{
        
        const{ name, image, type, price, countInStock, rating, description, discount} = newProduct
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
                name, image, type, price, countInStock, rating, description, discount
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
                    status: 'OK',
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



const getAllProduct = (limit, page, sort, filter) =>{
    return new Promise( async (resolve, reject) =>{
        try{
            const totalProduct = await Product.countDocuments()
            let allProduct = []
            if(filter){
                const lable = filter[0];
                const allObjectFilter = await Product.find({[lable]: {'$regex' : filter[1]}})
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allObjectFilter,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
            if(sort){
                const objectSort = {}
                objectSort[sort[1]] = sort[0]
                const allProductSort = await Product.find().limit(limit).skip(page * limit).sort(objectSort)
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allProductSort,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
            if(!limit){
                allProduct = await Product.find()
            }else{
                allProduct = await Product.find().limit(limit).skip(page * limit)
            }
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

const getCategory = () =>{
    return new Promise( async (resolve, reject) =>{
        try{
            const allCategory = await Product.distinct('type')
            resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allCategory,
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
    getCategory,
}