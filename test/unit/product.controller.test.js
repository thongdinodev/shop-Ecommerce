const productController = require('../../controllers/productController')
const productModel = require('../../models/productModel')
const httpMocks = require('node-mocks-http')
const newProduct = require('../mock-data/mock-data-product/new-product.json')

jest.mock('../../models/productModel')

let req, res, next

beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = null
})

describe('productController.getAllProducts', () => {
    it('should have a getAllProducts function', () => {
        expect(typeof productController.getAllProducts).toBe('function')
    })
    it('should return all products and response http code 200', async () => {
        
    })
})

describe('productController.createProduct', () => {
    beforeEach(() => {
        req.body = newProduct
    })
    it('should have a createProduct function', () => {
        expect(typeof productController.createProduct).toBe('function')
    })
    it('should call productModel.create with newProduct', async () => {
        await productController.createProduct(req, res, next)
        expect(productModel.create).toBeCalledWith(newProduct)
    })


})