import usersController from "../controllers/users.controller.js";
import { Router } from "express";
import { verifyTokenAuth } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/", usersController.findAllUsers);
router.get("/:id", usersController.findUsersById);
router.post("/", usersController.createUsers);
router.put("/:id", usersController.updateUsers);
router.delete("/:id", usersController.deleteUsers);
router.delete("/soft/:id", usersController.deleteSoftUsers);
router.post("/login", usersController.loginUsers);
router.post("/logout", usersController.logoutUsers);
router.post("/current", verifyTokenAuth, usersController.currentUsers);
router.post("/forgot-password", usersController.forgotPasswordUsers);
router.get("/reset-password/:token", usersController.validateResetPasswordToken);
router.post("/reset-password", usersController.resetPasswordUsers);
router.post('/premium/:uid', upload.fields([
    { name: 'document', maxCount: 3 }
]), usersController.premiumUserRole);

// Endpoint para subir documentos con Multer
router.post('/:uid/documents', upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'product', maxCount: 10 },
    { name: 'document', maxCount: 10 }
]), usersController.uploadDocuments);

export default router;