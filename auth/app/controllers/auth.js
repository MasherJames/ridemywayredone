import bcryptjs from "bcryptjs";

import models from "../db/models";
import {
  generateToken,
  validateRegistrationInputs,
  messagePublisher,
  getUser,
  ErrorHandler,
} from "../utils";

const User = models.User;
const Driver = models.Driver;
const Passenger = models.Passenger;
const PhoneVerification = models.phoneVerification;
const sequelize = models.sequelize;
class AuthController {
  static async register(userInput) {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      userType,
    } = userInput;

    // handle user input validations
    const { errors, isError } = validateRegistrationInputs(userInput);
    if (isError) {
      ErrorHandler.userInputError("User inputs invalid", errors);
    }

    // check if user with email exists
    const existingUserWithEmail = await User.findOne({
      where: { email },
    });

    if (existingUserWithEmail) {
      ErrorHandler.apolloError(
        `User with email ${email} already exists`,
        "USER_WITH_EMAIL_EXISTS_ERROR"
      );
    }
    // check if user with phone exists
    const existingUserWithPhone = await User.findOne({
      where: { phoneNumber },
    });

    if (existingUserWithPhone) {
      ErrorHandler.apolloError(
        `User with phone number ${phoneNumber} already exists`,
        "USER_WITH_PHONE_EXISTS_ERROR"
      );
    }

    let hash;
    try {
      // generate password hash
      const salt = await bcryptjs.genSalt(10);
      hash = await bcryptjs.hash(password, salt);
    } catch (error) {
      ErrorHandler.apolloError(error.message, "PASSWORD_HASH_ERROR");
    }

    // start a transaction
    const t = await sequelize.transaction();
    let newUser;
    try {
      // trigger user creation, passing transaction as an option
      newUser = await User.create(
        {
          firstName,
          lastName,
          email,
          password: hash,
          phoneNumber,
          userType,
        },
        { transaction: t }
      );
      // commit the transaction if no error
      await t.commit();
    } catch (error) {
      // rollback the transaction if error
      await t.rollback();
      // throw error
      ErrorHandler.apolloError(error.message, "USER_CREATE_ERROR_ROLLED_BACK");
    }

    // send email after sign up
    try {
      const confirmEmailToken = await generateToken({
        uuid: newUser.uuid,
      });

      const mailOptions = {
        from: process.env.SEND_EMAIL,
        to: `${email}`,
        subject: "Confirm Email",
        text: `Thank you ${email} for using our platform\nClick the link below to confirm your email\nhttp://127.0.0.1:4000/email/confirm/${confirmEmailToken}`,
      };

      await messagePublisher(mailOptions, "emails");
    } catch (error) {
      ErrorHandler.apolloError(error.message, "SENDING_EMAIL_ERROR");
    }

    // phone verification code
    const smsCode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);

    const smsOptions = {
      to: phoneNumber,
      message: `Your ride my way verification code is ${smsCode}`,
      enque: true,
    };

    await messagePublisher(smsOptions, "sms");

    // start a transaction
    const trans = await sequelize.transaction();

    try {
      await PhoneVerification.create(
        {
          token: smsCode,
          userId: newUser.uuid,
        },
        { transaction: trans }
      );
      // commit the transaction if no error
      await trans.commit();

      // pass auth token to be used in passenger or driver creation
      const authToken = await generateToken({
        uuid: newUser.uuid,
      });

      return {
        success: true,
        message:
          "User successfully created, please confirm your email and phone",
        token: authToken,
        user: newUser,
      };
    } catch (error) {
      // rollback the transaction if error
      await trans.rollback();
      // throw error
      ErrorHandler.apolloError(error.message, "PHONE_VERIFICATION_ERROR");
    }
  }

  static async verifyEmail(emailVerificationInput) {
    // decode and get the passed uuid(payload)
    const { verificationEmailToken } = emailVerificationInput;

    let payload;
    try {
      payload = getUser(verificationEmailToken);
    } catch (error) {
      ErrorHandler.apolloError(error.message, "EMAIL_VERIFICATION_ERROR");
    }

    const user = await User.findOne({ where: { uuid: payload.uuid } });

    // avoid verification of an email twice before the token expires
    if (user.isEmailVerified) {
      ErrorHandler.apolloError(
        "Email already verified",
        "EMAIL_VERIFIED_WARNING"
      );
    }

    // Else initialize a transaction
    const t = await sequelize.transaction();

    try {
      await User.update(
        { isEmailVerified: true },
        { where: { uuid: user.uuid }, transaction: t }
      );
      // commit the transaction if no error
      await t.commit();

      return {
        success: true,
        message: "Email successfully verified",
      };
    } catch (error) {
      // rollback the transaction if error
      await t.rollback();
      // throw error
      ErrorHandler.apolloError(error.message, "EMAIL_VERIFICATION_ROLLED_BACK");
    }
  }

  static async verifyPhone(phoneVerificationInput) {
    const { phoneVerificationCode } = phoneVerificationInput;
    const verificationCode = await PhoneVerification.findOne({
      where: {
        token: phoneVerificationCode,
      },
    });

    // If code doesn't exist, its invalid or the user doesn't exist
    if (!verificationCode) {
      ErrorHandler.apolloError(
        "Invalid phone verification code",
        "PHONE_VERIFICATION_ERROR"
      );
    }

    // Else get the corresponding user uuid
    const user = await User.findOne({
      where: {
        uuid: verificationCode.userId,
      },
    });

    // avoid verification of the phone twice
    if (user.isPhoneVerified) {
      ErrorHandler.apolloError(
        "Phone already verified",
        "PHONE_VERIFIED_WARNING"
      );
    }

    const t = await sequelize.transaction();
    try {
      // update the corresponding user
      await User.update(
        {
          isPhoneVerified: true,
        },
        {
          where: {
            uuid: user.uuid,
          },
          transaction: t,
        }
      );
      // commit the transaction if no error
      await t.commit();

      return {
        success: true,
        message: "Phone successfully verified",
      };
    } catch (error) {
      // rollback the transaction if error
      await t.rollback();
      // throw error
      ErrorHandler.apolloError(error.message, "PHONE_VERIFICATION_ROLLED_BACK");
    }
  }

  static async fetchAllUsers() {
    const t = await sequelize.transaction();
    try {
      const users = await User.findAll({ transaction: t });
      if (users.length === 0) {
        return { message: "There are no users" };
      }
      // commit the transaction if no error
      await t.commit();
      return users;
    } catch (error) {
      // rollback the transaction if error
      await t.rollback();
      // throw error
      ErrorHandler.apolloError(error.message, "FETCHING_USERS_ERROR");
    }
  }

  static async fetchUser(userUuid) {
    const t = await sequelize.transaction();
    try {
      const user = await User.findByPk(userUuid, { transaction: t });
      if (!user) {
        return { message: "User not found" };
      }
      // commit the transaction if no error
      await t.commit();
      return user;
    } catch (error) {
      // rollback the transaction if error
      await t.rollback();
      // throw error
      ErrorHandler.apolloError(error.message, "FETCHING_USER_ERROR");
    }
  }

  static async login(loginInput) {
    const { email, password } = loginInput;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      ErrorHandler.authenticationError(
        "User with email does not exist!",
        "WRONG_EMAIL_ERROR"
      );
    }

    let isMatch;
    try {
      isMatch = await bcryptjs.compare(password, user.password);
    } catch (error) {
      ErrorHandler.apolloError(
        `Am error occurred: ${error.message}`,
        "PASSWORD_HASH_COMPARE_ERROR"
      );
    }

    if (!isMatch) {
      ErrorHandler.authenticationError(
        `Wrong password for ${email}`,
        "WRONG_PASSWORD_ERROR"
      );
    }

    // Fetch corresponding driver / passenger uuid
    let driver, passenger;
    try {
      driver = await Driver.findOne({
        where: { userId: user.uuid },
      });
      passenger = await Passenger.findOne({
        where: { userId: user.uuid },
      });
    } catch (error) {
      ErrorHandler.apolloError(
        error.message,
        "CORRESPONDING_DRIVER_PASSENGER_ERROR"
      );
    }

    const tokenPayload = {
      email: user.email,
      uuid: user.uuid,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      userType: user.userType,
      driver: driver ? driver.uuid : null,
      passenger: passenger ? passenger.uuid : null,
    };

    const authToken = await generateToken(tokenPayload);

    return {
      success: true,
      message: "successfully logged in",
      token: authToken,
      user,
    };
  }
}
export default AuthController;
