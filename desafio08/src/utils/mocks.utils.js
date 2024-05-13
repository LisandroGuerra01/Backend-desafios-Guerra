import { faker } from '@faker-js/faker';

class Product {
    constructor() {
        this.id = faker.database.mongodbObjectId();
        this.name = faker.commerce.productName();
        this.description = faker.commerce.productDescription();
        this.category = faker.commerce.department();
        this.price = faker.commerce.price();
        this.stock = faker.string.numeric();
    }
}

class Products {
    constructor() {
        this.products = [];
        this.generateProducts();
    }

    generateProducts() {
        for (let i = 0; i < 100; i++) {
            this.products.push(new Product());
        }
    }
}

const productsMocks = new Products();

export default productsMocks;