class ProductManager {
    constructor() {
        this.products = [];
        this.id = 1;
    }

    addProduct(title, description, price, thumbnail, code, stock) {

        //Validación de que todas las propiedades son obligatorias
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Completar todos los campos");
            return;
        }
        //Validación de que no se repita la propiedad code
        if (this.products.some(product => product.code === code)) {
            console.log(`El código ${code} del producto ${title} ya existe`);
            return;
        }

        //Propiedades del objeto
        const product = {
            id: this.id++, //Incremento automático de id
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        //Agregar el producto al array
        this.products.push(product);
    }


    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return (`El producto con id ${id} es: ${product.title} - Código: ${product.code} - Precio: ${product.price}`);
        } else {
            console.log(`Producto con id ${id}  no encontrado`)
        }
    }
}

// Agrego instancias a modo de ejemplo
const newProduct = new ProductManager();

newProduct.addProduct("Producto 1", "Descripción 1", 100, "Imagen 1", "0001", 10);
newProduct.addProduct("Producto 2", "Descripción 2", 200, "Imagen 2", "0002", 20);
newProduct.addProduct("Producto 3", "Descripción 3", 300, "Imagen 3", "0002", 30); //No lo agrega porque el prod ya existe
newProduct.addProduct("Producto 4", "Descripción 4", 400, "Imagen 4", "0004", 40);
newProduct.addProduct("Producto 5", "Descripción 5", 500, "Imagen 5", "0005", 50);


console.log(newProduct.getProducts());
console.log(newProduct.getProductById(4));
console.log(newProduct.getProductById(5));
