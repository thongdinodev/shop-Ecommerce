const productController = require('../../controllers/productController')
const productModel = require('../../models/productModel')
const httpMocks = require('node-mocks-http')
const newProduct = require('../mock-data/mock-data-product/new-product.json')
const returnProduct = require('../mock-data/mock-data-product/return-product.json')
const allProducts = require('../mock-data/mock-data-product/all-products.json')

jest.mock('../../models/productModel')

let req, res, next

const productId = '661f43996e6825ac54d089ab'

beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = null
})

describe('productController.getProduct', () => {
    it('should have a getProduct function', () => {
        expect(typeof productController.getProduct).toBe('function')
    })
    it('should call productModel.findById with query parameter', async () => {
        req.params.id = productId
        await productController.getProduct(req, res, next)
        expect(productModel.findById).toBeCalledWith(productId)
    })
    it('should return json body and response code 200', async () => {
        productModel.findById.mockReturnValue(newProduct)
        await productController.getProduct(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(returnProduct)
    })
})

describe('productController.getAllProducts', () => {
    it('should have a getAllProducts function', () => {
        expect(typeof productController.getAllProducts).toBe('function')
    })
    it('should call todoModel.find', async () => {
        req.params.productId = productId
        await productController.getAllProducts(req, res, next)
        expect(productModel.find).toBeCalledWith({})
    })
    it('should return all products and response http code 200', async () => {
        productModel.find.mockReturnValue(allProducts)
        await productController.getAllProducts(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(allProducts)
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
    it('should return 201 status code and json body response', async () => {
        productModel.create.mockReturnValue(newProduct)
        await productController.createProduct(req, res, next)
        expect(res.statusCode).toBe(201)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(returnProduct)
    })
})