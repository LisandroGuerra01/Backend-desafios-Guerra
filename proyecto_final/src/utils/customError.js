export default class customError {
    static createCustomError({ name, message, cause}) {
        const customError = new Error(message, { cause });
        customError.name = name;
        throw customError;
    }
}