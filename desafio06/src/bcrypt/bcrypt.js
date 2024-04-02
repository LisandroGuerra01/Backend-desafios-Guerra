import bcrypt from "bcrypt";

export const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

export const comparePassword = (password, receivedPassword) => {
    return bcrypt.compareSync(password, receivedPassword);
}
