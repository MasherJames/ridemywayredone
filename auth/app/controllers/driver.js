import { UserInputError, ApolloError } from "apollo-server-express";
import models from "../db/models";

import validDriverRegistration from "../utils/validations/driverRegister";

const Driver = models.Driver;
const User = models.User;
const sequelize = models.sequelize;

class DriverController {
  static async registerDriver(driverInput, currentUser) {
    // de-structure the driver input
    const { licenseNumber, ntsaNumber } = driverInput;

    // handle user input validations
    const { errors, isError } = validDriverRegistration(driverInput);
    if (isError) {
      throw new UserInputError("Driver inputs invalid", errors);
    }

    // User must have finished phone and email verification
    const user = await User.findOne({ where: { uuid: currentUser.uuid } });

    if (!user.isEmailVerified || !user.isPhoneVerified) {
      throw new ApolloError(
        `Please verify your ${!isEmailVerified ? "email" : "phone number"}`,
        `${!isEmailVerified ? "EMAIL" : "PHONE_NUMBER"}_VERIFICATION_ERROR`
      );
    }

    // check if driver with that licenseNumber exists
    const existingDriverWithSameLicenseNumber = await Driver.findOne({
      where: {
        licenseNumber,
      },
    });

    if (existingDriverWithSameLicenseNumber) {
      throw new ApolloError(
        "Driver with this license number already exists",
        "DRIVER_WITH_LICENSE_NUMBER_EXISTS_ERROR"
      );
    }
    // check if driver with phone exists
    const existingDriverWithSameNtsaNumber = await Driver.findOne({
      where: {
        ntsaNumber,
      },
    });

    if (existingDriverWithSameNtsaNumber) {
      throw new ApolloError(
        "Driver with this Ntsa number already exists",
        "Driver_WITH_NTSA_NUMBER_EXISTS_ERROR"
      );
    }

    // start a transaction
    const t = await sequelize.transaction();

    try {
      // do a call, passing transaction as an option
      const driver = await Driver.create(
        {
          licenseNumber,
          ntsaNumber,
          userId: currentUser.uuid,
        },
        {
          transaction: t,
        }
      );
      // commit the transaction if no error
      await t.commit();

      return {
        success: true,
        message: "Driver successfully created",
        driver,
      };
    } catch (error) {
      // rollback the transaction if error
      await t.rollback();
      // throw error
      throw new ApolloError(error.message, "Driver_CREATE_ERROR_ROLLED_BACK");
    }
  }
}

export default DriverController;
