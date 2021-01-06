import models from "../db/models";
import { validDriverRegistrationInputs, ErrorHandler } from "../utils";

const Driver = models.Driver;
const User = models.User;
const sequelize = models.sequelize;

class DriverController {
  static async registerDriver(driverInput, currentUser) {
    // de-structure the driver input
    const { licenseNumber, ntsaNumber } = driverInput;

    // handle user input validations
    const { errors, isError } = validDriverRegistrationInputs(driverInput);
    if (isError) {
      ErrorHandler.userInputError("Driver inputs invalid", errors);
    }

    // User must have finished phone and email verification
    const user = await User.findOne({ where: { uuid: currentUser.uuid } });

    if (!user.isEmailVerified || !user.isPhoneVerified) {
      ErrorHandler.apolloError(
        `Please verify your ${
          !user.isEmailVerified ? "email" : "phone number"
        }`,
        `${!user.isEmailVerified ? "EMAIL" : "PHONE_NUMBER"}_VERIFICATION_ERROR`
      );
    }

    // check if driver with that licenseNumber exists
    const existingDriverWithSameLicenseNumber = await Driver.findOne({
      where: {
        licenseNumber,
      },
    });

    if (existingDriverWithSameLicenseNumber) {
      ErrorHandler.apolloError(
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
      ErrorHandler.apolloError(
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
      ErrorHandler.apolloError(
        error.message,
        "Driver_CREATE_ERROR_ROLLED_BACK"
      );
    }
  }

  static async fetchDriver(driverUuid) {
    // start a transaction
    const t = await sequelize.transaction();

    try {
      const driver = await Driver.findByPk(driverUuid, { transaction: t });

      if (!driver) {
        return { message: "driver does not exist" };
      }
      await t.commit();
      return driver;
    } catch (error) {
      // rollback transaction
      await t.rollback();
      // throw the error
      ErrorHandler.apolloError(error.message, "FETCH_DRIVER_ERROR_ROLLED_BACK");
    }
  }
}

export default DriverController;
