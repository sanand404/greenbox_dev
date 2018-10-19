import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import UserModel from "../../user/models/userModel";

dotenv.load();

class LoginController {
  createUser = async (req, res) => {
    const newUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailId: req.body.emailId,
      password: req.body.password,
      domain: "playsoftech.in"
    };

    try {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newUser.password, salt);

      newUser.password = passwordHash;
      UserModel.addUser(newUser)
        .then(user => {
          if (user) {
            res.send({ success: true, result: newUser });
          }
        })
        .catch(err => {
          res.send({ success: false, error: err });
        });
    } catch (err) {
      res.send({ success: false, error: err });
    }
  };

  login = async (req, res) => {
    //Check Email And Domain
    const user = await UserModel.getUserByDomain(req.body);

    if (!user) {
      res.send({ success: false, message: "EmailId not found" });
    }

    const password = user.result[0].password;
    const isMatch = await bcrypt.compare(req.body.password, password);

    if (!isMatch) {
      res.send({ success: false, message: "Password is incorrect" });
    }

    UserModel.getUserByEmailId({
      emailId: req.body.emailId,
      password: password,
      domain: req.body.domain
    })
      .then(user => {
        if (user) {
          const payload = {
            id: user.result[0].idUser,
            emailId: user.result[0].emailId
          };
          jwt.sign(
            payload,
            process.env.SECRET_KEY,
            {
              //iat: new Date().getTime(),
              expiresIn: new Date().setDate(new Date().getDate() + 1)
            },
            (err, token) => {
              if (err) res.send({ token: false });
              res.send({ token: token });
            }
          );
        } else {
          res.send({ success: false, token: "Error in generating token" });
        }
      })
      .catch(err => {
        console.log("Error in login ", err);
      });
  };
}

export default new LoginController();
