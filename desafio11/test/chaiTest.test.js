import { expect } from 'chai';
import productsMongo from '../src/DAL/DAOs/productsDaos/productsMongo.js';
import connectDB from '../src/DAL/mongoDB/dbConfig.js';

connectDB();

describe('Set de test de chai', () => {
    before(function () {
    })

    beforeEach(function () {
    })

    it('El Dao debe poder obtener los productos en formato de array', async () => {
        const result = await productsMongo.findAll();
        expect(Array.isArray(result)).to.be.true;
    })

    it('Se comprueba si el array de productos tiene al menos un producto', async () => {
        const result = await productsMongo.findAll();
        expect(result.length).to.be.greaterThan(0);
    })

    it('Debe agregar un producto a la base de datos', async () => {
        const product = {
            name: "Test2",
            description: "Test2",
            price: 100,
            stock: 100,
        }
        const result = await productsMongo.create(product);
        expect(result).to.be.an('object');
        expect(result).to.have.property('_id');
    })

})