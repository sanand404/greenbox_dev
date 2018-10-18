class LoginController {
    createUser = (req, res) => {
        const newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        };

        res.send(newUser);
    }
}

export default new LoginController();