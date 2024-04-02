export const auth = async (req, res, next) => {
    try {
        if (req.session.passport) {
            next();
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const isLogged = async (req, res, next) => {
    try {
        if (req.session.passport) {
            res.redirect('/profile');
        } else {
            next();
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}