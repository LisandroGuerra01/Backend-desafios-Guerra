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
            const result = await usersService.delete(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json(error);
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

}

const usersController = new UsersController();

export default usersController;