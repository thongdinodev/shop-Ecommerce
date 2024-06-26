const Joi = require('joi')

const userValidate = data => {
    const userSchema = Joi.object({
        name: Joi.string().lowercase().required(),
        email: Joi.string().pattern(new RegExp('gmail.com$')).email().lowercase().required(),
        password: Joi.string().min(8).max(32).required(),
        passwordConfirm: Joi.ref('password')
    })

    return userSchema.validate(data)
} 

const productValidate = data => {
    const productSchema = Joi.object({
        name: Joi.string().min(5).max(30).required(),
        price: Joi.number().positive().error((errors) => new Error('"price" requires a positive number greater than 0')).required(),
        image: Joi.string().required(),
        description: Joi.string().min(5).required(), 
        instock: Joi.number().min(0).error((errors) => new Error('"instock" requires a positive number')).required()
    })

    return productSchema.validate(data)
}

const reviewValidate = data => {
    const reviewSchema = Joi.object({
        review: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required()
    })

    return reviewSchema.validate(data)
}

module.exports = {
    userValidate,
    productValidate,
    reviewValidate
}