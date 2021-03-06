import models from "../db/models";
import { validPassengerRegistrationInputs, ErrorHandler } from "../utils";

const Passenger = models.Passenger;
const User = models.User;
const sequelize = models.sequelize;

class PassengerController {
  static async registerPassenger(passengerInput, currentUser) {
    // de-structure the passenger input
    const { nationalId, placeOfResidence } = passengerInput;

    // handle user input validations
    const { errors, isError } = validPassengerRegistrationInputs(
      passengerInput
    );
    if (isError) {
      ErrorHandler.userInputError("Passenger inputs invalid", errors);
    }

    // User must have finished phone and email verification
    const user = await User.findOne({
      where: {
        uuid: currentUser.uuid,
      },
    });
    if (!user.isEmailVerified || !user.isPhoneVerified) {
      ErrorHandler.apolloError(
        `Please verify your ${
          !user.isEmailVerified ? "email" : "phone number"
        }`,
        `${!user.isEmailVerified ? "EMAIL" : "PHONE_NUMBER"}_VERIFICATION_ERROR`
      );
    }

    // check if passenger with that national Id exists
    const existingPassengerWithSameNationalId = await Passenger.findOne({
      where: {
        nationalId,
      },
    });

    if (existingPassengerWithSameNationalId) {
      ErrorHandler.apolloError(
        `Passenger with this national id already exists`,
        "PASSENGER_WITH_NATIONAL_ID_EXISTS_ERROR"
      );
    }

    // start a transaction
    const t = await sequelize.transaction();

    try {
      // do a call, passing transaction as an option
      const passenger = await Passenger.create(
        {
          nationalId,
          placeOfResidence,
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
        message: "Passenger successfully created",
        passenger,
      };
    } catch (error) {
      // rollback the transaction if error
      await t.rollback();
      // throw error
      ErrorHandler.apolloError(
        error.message,
        "PASSENGER_CREATE_ERROR_ROLLED_BACK"
      );
    }
  }
  static async fetchPassenger(passengerUuid) {
    // start a transaction
    const t = await sequelize.transaction();

    try {
      const passenger = await Passenger.findByPk(passengerUuid, {
        transaction: t,
      });

      if (!passenger) {
        return { message: "passenger does not exist" };
      }
      await t.commit();
      return passenger;
    } catch (error) {
      // rollback transaction
      await t.rollback();
      // throw the error
      ErrorHandler.apolloError(
        error.message,
        "FETCH_PASSENGER_ERROR_ROLLED_BACK"
      );
    }
  }
}

export default PassengerController;
