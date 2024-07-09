import usersService from "../services/users.service.js";


class UsersController {
    async findAllUsers(req, res) {
        try {
            const result = await usersService.findAll();
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json(error);
        }
    }

    async findUsersById(req, res) {
        try {
            const result = await usersService.findById(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json(error);
        }
    }

    async createUsers(req, res) {
        try {
            const result = await usersService.create(req.body);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json(error);
        }
    }

    async updateUsers(req, res) {
        try {
            const result = await usersService.update(req.params.id, req.body);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json(error);
        }
    }

    async deleteUsers(req, res) {
        try {
            const result = await usersService.deleteIfInactive(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async deleteSoftUsers(req, res) {
        try {
            const result = await usersService.deleteSoft(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json(error);
        }
    }

    async loginUsers(req, res) {
        try {
            const result = await usersService.login(req.body);
            res.cookie("token", result, { httpOnly: true });
            res.status(200).json(`Token: ${result}`);
        } catch (error) {
            res.status(400).json(error);
        }
    }

    async logoutUsers(req, res) {
        try {
            const tokenUser = req.cookies.token;
            const { email } = await usersService.current(tokenUser);
            const result = await usersService.logout(email);
            res.clearCookie("token");
            res.status(200).json("Logout OK");
        } catch (error) {
            res.status(400).json(error);
        }
    }

    async currentUsers(req, res) {
        try {
            const tokenUser = req.cookies.token;
            const result = await usersService.current(tokenUser);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json(error);
        }
    }

    async forgotPasswordUsers(req, res) {
        try {
            const result = await usersService.forgotPassword(req.body.email);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json(error);
        }
    }

    async validateResetPasswordToken(req, res) {
        try {
            const result = await usersService.validateToken(req.params.token);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json(error);
        }
    }

    async resetPasswordUsers(req, res) {
        try {
            const result = await usersService.resetPassword(req.body);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json(error);
        }
    }

    async premiumUserRole(req, res) {
        if (!req.files) {
            return res.status(400).json({ message: 'Los documentos no fueron cargados' });
        }
        if (req.files.document.length < 3) {
            return res.status(400).json({ message: 'Se necesitan 3 documentos' });
        }

        try {
            const result = await usersService.changeRole(req.params.uid);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json(error);
        }
    }

    async uploadDocuments(req, res) {
        const { uid } = req.params;
        const files = req.files;

        try {
            const user = await usersService.updateUserStatus(uid, 'approved');
            res.status(200).json({
                message: 'Documento subido exitosamente',
                files: files,
                user: user
            });
        } catch (error) {
            await usersService.updateUserStatus(uid, 'rejected');
            res.status(500).json({ message: 'Error al subir archivo', error: error.message });
        }
    }

}

const usersController = new UsersController();

export default usersController;