export default class BasicMongo {
    constructor(model) {
        this.model = model;
    }

    async findAll() {
        try {
            const result = await this.model.find();
            return result;
        } catch (error) {
            return error;
        }
    }

    async findById(id) {
        try {
            const result = await this.model.findById(id);
            return result;
        } catch (error) {
            return error;
        }
    }

    async create(data) {
        try {
            const result = await this.model.create(data);
            return result;
        } catch (error) {
            return error;
        }
    }

    async update(id, data) {
        try {
            const result = await this.model.findOneAndUpdate({ _id: id }, data, { new: true });
            return result;
        } catch (error) {
            return error;
        }
    }

    async delete(id) {
        try {
            const result = await this.model.findByIdAndDelete(id);
            if (!result) {
                throw new Error('Usuario no encontrado');
            }
            return result;
        } catch (error) {
            return error;
        }
    }

    //Borrar indicando status "inactive" realizando un update en vez de un delete
    async deleteSoft(id) {
        try {
            const result = await this.model.findOneAndUpdate({ _id: id }, { status: "inactive", deleteAt: Date.now() }, { new: true });
            return result;
        } catch (error) {
            return error;
        }
    }

    //Buscar por campo en particular y devolver un array de resultados
    async findByField(field, value) {
        try {
            const result = await this.model.find({ [field]: value });
            return result;
        } catch (error) {
            return error;
        }
    }
}