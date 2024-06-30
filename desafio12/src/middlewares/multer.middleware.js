import multer from 'multer';

const storage = multer.diskStorage({
    //Ubicación del archivo
    destination: (req, file, cb) => {
        if (file.fieldname === 'profile') {
            cb(null, './uploads/profile');
        } else if (file.fieldname === 'products') {
            cb(null, './uploads/products');
        } else {
            cb(null, './uploads/documents');
        }
    },
    //Nombre del archivo
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({ storage: storage });

export default upload