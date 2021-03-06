import models from "../db/models";
import { validRideInputs } from "../utils";

const Ride = models.Ride;
const sequelize = models.sequelize;

class RideController {
  static async addRide(rideInputs, driver) {
    const { origin, destination, departureTime, car } = rideInputs;

    // handle user input validations
    const { errors, isError } = validRideInputs(
      origin,
      destination,
      departureTime
    );
    if (isError) {
      ErrorHandler.userInputError("Ride inputs invalid", errors);
    }

    // start a transaction
    const t = await sequelize.transaction();

    try {
      const ride = await Ride.create(
        {
          origin,
          destination,
          departureTime,
          carId: car,
          driver,
        },
        { transaction: t }
      );
      // commit the transaction if no error
      await t.commit();

      return {
        success: true,
        message: "Ride successfully added",
        ride,
      };
    } catch (error) {
      // rollback the transaction if error
      await t.rollback();
      // throw error
      ErrorHandler.apolloError(error.message, "RIDE_CREATE_ERROR_ROLLED_BACK");
    }
  }
  static async amendRide(rideInputs, rideUuid) {
    let { origin, destination, departureTime, car } = rideInputs;

    // handle user input validations
    const { errors, isError } = validRideInputs(
      origin,
      destination,
      departureTime
    );
    if (isError) {
      ErrorHandler.userInputError("Ride inputs invalid", errors);
    }

    const rideToUpDate = await Ride.findByPk(rideUuid);
    if (!rideToUpDate) {
      ErrorHandler.apolloError(
        "Ride with that id does not exist",
        "RIDE_DOES_NOT_EXIST"
      );
    }

    origin = origin ? origin : rideToUpDate.origin;
    destination = destination ? destination : rideToUpDate.destination;
    departureTime = departureTime ? departureTime : rideToUpDate.departureTime;
    car = car ? car : rideToUpDate.car;
    // start a transaction
    const t = await sequelize.transaction();

    try {
      const ride = await Ride.update(
        {
          origin,
          destination,
          departureTime,
          carId: car,
        },
        { returning: true, where: { uuid: rideUuid } },
        { transaction: t }
      );
      // commit the transaction if no error
      await t.commit();

      return {
        success: true,
        message: "Ride successfully amended",
        ride,
      };
    } catch (error) {
      // rollback the transaction if error
      await t.rollback();
      // throw error
      ErrorHandler.apolloError(error.message, "RIDE_AMEND_ERROR_ROLLED_BACK");
    }
  }
  static async fetchAllRides() {
    const t = await sequelize.transaction();
    try {
      const allRides = await Ride.findAll({ transaction: t });
      if (allRides.length === 0) {
        return { message: "There are no rides for now" };
      }
      // commit the transaction if no error
      await t.commit();
      return allRides;
    } catch (error) {
      // rollback the transaction if error
      await t.rollback();
      // throw error
      ErrorHandler.apolloError(error.message, "FETCHING_RIDES_ERROR");
    }
  }

  static async fetchAllMyRides(driver) {
    const t = await sequelize.transaction();
    try {
      const allRides = await Ride.findAll({
        where: { driver },
        transaction: t,
      });
      if (!allRides.length) {
        return { message: "There are no rides for now" };
      }
      // commit the transaction if no error
      await t.commit();
      return allRides;
    } catch (error) {
      // rollback the transaction if error
      await t.rollback();
      // throw error
      ErrorHandler.apolloError(error.message, "FETCHING_RIDES_ERROR");
    }
  }

  static async fetchRide(rideUuid) {
    const t = await sequelize.transaction();
    try {
      const ride = await Ride.findByPk(rideUuid, { transaction: t });
      if (!ride) {
        return { message: "Ride not found" };
      }
      // commit the transaction if no error
      await t.commit();
      return ride;
    } catch (error) {
      // rollback the transaction if error
      await t.rollback();
      // throw error
      ErrorHandler.apolloError(error.message, "FETCHING_RIDE_ERROR");
    }
  }
}
export default RideController;
