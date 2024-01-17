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

console.log("Se llama al array vacío:");
console.log(newProduct.getProducts());

newProduct.addProduct("Producto prueba", "Este es un producto prueba", 200, "Imagen 1", "abc123", 25);
console.log("Se llama al array con el primer producto cargado:");
console.log(newProduct.getProducts());

newProduct.addProduct("Producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
console.log(newProduct.getProducts());

console.log("Se filtra por ID:");
console.log(newProduct.getProductById(1));
