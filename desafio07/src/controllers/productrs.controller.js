import {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} from "../services/products.service.js";

//Busca todos los productos
export const findAllProducts = async (req, res) => {
    try {
        const { limit, page, sort, query } = req.body;
        const allProducts = await getProducts(limit, page, sort, query);
        res.status(200).send({ status: "success", payload: allProducts.products, info: allProducts.info });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al obtener los productos" });
    }
}

//Busca un producto
export const findOneProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await getProductById(pid);
        if (product) {
            res.status(200).send({ status: "success", payload: product });
        } else {
            res.status(404).send({ status: "error", error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al obtener el producto" });
    }
}

//Agrega un producto
export const addOneProduct = async (req, res) => {
    try {
        const product = req.body;
        if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
            res.status(400).send({ status: "error", error: "Faltan datos del producto" });
            return;
        }

        const newProduct = await addProduct(product);
        res.status(201).send({ status: "success", payload: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al agregar el producto" });
    }
}

//Actualiza un producto
export const updateOneProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = req.body;
        const updatedProduct = await updateProduct({ _id: pid }, product);
        if (updateProduct) {
            res.status(200).send({ status: "success", payload: updatedProduct });
        } else {
            res.status(404).send({ status: "error", error: "Producto no encontrado" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al actualizar el producto" });
    }
}

//Elimina un producto
export const deleteOneProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const deletedProduct = await deleteProduct({ _id: pid });
        if (deletedProduct) {
            res.status(200).send({ status: "success", payload: deletedProduct });
        } else {
            res.status(404).send({ status: "error", error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al eliminar el producto" });
    }
}