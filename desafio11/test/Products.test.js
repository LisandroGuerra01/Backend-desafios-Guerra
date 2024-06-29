import productsMongo from '../src/DAL/DAOs/productsDaos/productsMongo.js';
import Assert from 'assert';
import connectDB from '../src/DAL/mongoDB/dbConfig.js';
import mongoose from 'mongoose';

connectDB();

const assert = Assert.strict;

describe('Testing Products DAO', () => {
    before(async function () {
        await connectDB();
    });

    beforeEach(async function () {
        this.timeout(5000);
        await mongoose.connection.collections.users.drop();
    });
    it('El Dao debe poder obtener los productos en formato de array', async () => {
        // console.log(productsMongo);
        const isArray = true;
        const result = await productsMongo.findAll();
        console.log(`El resultado es un array? : ${Array.isArray(result)}`);
        assert.strictEqual(Array.isArray(result), isArray);
    });
});