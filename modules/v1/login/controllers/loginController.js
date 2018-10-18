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

  login = (req, res) => {
    UserModel.getUserByEmailId(req.body)
      .then(user => {
        if (user) {
          console.log("User found ", JSON.stringify(user[0]));

          const payload = {
            id: user[0].idUser,
            emailId: user[0].emailId
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
          console.log("False User found ", user);
          res.send({ token: false });
        }
      })
      .catch(err => {
        console.log("Error in login ", err);
      });
  };
}

export default new LoginController();
