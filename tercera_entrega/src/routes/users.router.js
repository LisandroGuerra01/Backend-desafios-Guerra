import usersController from '../controllers/users.controller.js';
import { Router } from 'express';
import { verifyTokenAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get("/", usersController.findAllUsers);
router.get("/:id", usersController.findUserById);
router.post("/", usersController.createUser);
router.put("/:id", usersController.updateUsers);
router.delete("/:id", usersController.deleteUsers);
router.delete("/sotf/:id", usersController.deleteSoftUsers);
router.post("/login", usersController.loginUsers);
router.post("/logout", usersController.logoutUsers);
router.post("/current", verifyTokenAuth, usersController.currentUser);

export default router;