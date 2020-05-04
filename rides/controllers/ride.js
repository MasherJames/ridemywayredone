import { UserInputError, ApolloError } from "apollo-server";

import models from "../db/models";
import validRideInputs from "../utils/validators/ride";

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
      throw new UserInputError("Ride inputs invalid", errors);
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
      throw new ApolloError(error.message, "RIDE_CREATE_ERROR_ROLLED_BACK");
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
      throw new UserInputError("Ride inputs invalid", errors);
    }

    const rideToUpDate = await Ride.findByPk(rideUuid);
    if (!rideToUpDate) {
      throw new ApolloError(
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
      throw new ApolloError(error.message, "RIDE_AMEND_ERROR_ROLLED_BACK");
    }
  }
  static async fetchAllRides() {
    const t = await sequelize.transaction();
    try {
      const allRides = await Ride.findAll({ transaction: t });
      if (!allRides.length) {
        throw new ApolloError(
          "There are no rides for now",
          "NO_EXISTING_RIDES"
        );
      }
      // commit the transaction if no error
      await t.commit();
      return allRides;
    } catch (error) {
      // rollback the transaction if error
      await t.rollback();
      // throw error
      throw new ApolloError(
        "An error occurred while fetching rides",
        "FETCHING_RIDES_ERROR"
      );
    }
  }

  static async fetchRide(rideUuid) {
    const t = await sequelize.transaction();
    try {
      const ride = await Ride.findByPk(rideUuid, { transaction: t });
      if (!ride) {
        throw new ApolloError("Ride not found", "RIDE_NOT_FOUND");
      }
      // commit the transaction if no error
      await t.commit();
      return ride;
    } catch (error) {
      // rollback the transaction if error
      await t.rollback();
      // throw error
      throw new ApolloError(
        "An error occurred while fetching a ride",
        "FETCHING_RIDE_ERROR"
      );
    }
  }
}
export default RideController;
