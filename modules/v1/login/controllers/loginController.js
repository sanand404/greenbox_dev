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
      provider: "playsoftech"
    };

    try {
      UserModel.getUserByDomain({
        emailId: newUser.emailId,
        provider: newUser.provider
      }).then(async isUserExists => {
        if (isUserExists.result && isUserExists.result.length > 0) {
          return res.send({
            success: false,
            message: "EmailId already exists"
          });
        }

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
      });

      console.log("--------------");
    } catch (err) {
      res.send({ success: false, error: err });
    }
  };

  login = async (req, res) => {
    //Check Email And provider
    let emailId = "";
    let password = "";
    let provider = "";

    if (req.body && req.body.emailId) {
      console.log("In body ", req.body);
      emailId = req.body.emailId;
      password = req.body.password;
      provider = req.body.provider;
    } else if (req.user && req.user.user.length > 0) {
      console.log("In User body", req.user);
      emailId = req.user.user[0].emailId;
      password = req.user.user[0].password;
      provider = req.user.user[0].provider;
    } else if (req.user && req.user.user.emailId) {
      console.log("If User register for first time by google OAuth");
      emailId = req.user.user.emailId;
      password = req.user.user.password;
      provider = req.user.user.provider;
    }

    const user = await UserModel.getUserByDomain({
      emailId: emailId,
      password: password,
      provider: provider
    });

    console.log("$$$$$$$$$$", user);

    if (!user) {
      res.send({ success: false, message: "EmailId not found" });
    }
    const userPassword = user.result[0].password;

    if (provider !== "playsoftech" && password) {
      res.send({ success: false, message: "Invalid user" });
    }
    const isMatch = await bcrypt.compare(password, userPassword);

    console.log("Password Match ", isMatch);
    if (!isMatch && provider === "playsoftech") {
      res.send({ success: false, message: "Password is incorrect" });
    }

    UserModel.getUserByEmailId({
      emailId: emailId,
      password: userPassword,
      provider: provider
    })
      .then(user => {
        if (user) {
          const payload = {
            id: user.result[0].idUser,
            emailId: user.result[0].emailId,
            provider: user.result[0].provider
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
