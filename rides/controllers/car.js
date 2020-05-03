import { UserInputError, ApolloError } from "apollo-server-express";

import models from "../db/models";
import validCarInputs from "../utils/validators/car";

const Car = models.Car;
const sequelize = models.sequelize;

class CarController {
  static async addCar(carInput, driver) {
    const { model, make, capacity, registrationNumber } = carInput;

    // handle user input validations
    const { errors, isError } = validCarInputs(carInput);
    if (isError) {
      throw new UserInputError("User inputs invalid", errors);
    }

    const existingVehicleWithSameRegNo = await Car.findOne({
      where: { registrationNumber },
    });

    if (existingVehicleWithSameRegNo) {
      throw new ApolloError(
        "Vehicle with this registration already exists",
        "VEHICLE_EXISTS_ERROR"
      );
    }

    // start a transaction
    const t = await sequelize.transaction();

    try {
      const car = await Car.create(
        {
          model,
          make,
          capacity,
          registrationNumber,
          driver,
        },
        { transaction: t }
      );
      // commit the transaction if no error
      await t.commit();
      return {
        success: true,
        message: "Ride successfully added",
        car,
      };
    } catch (error) {
      // rollback the transaction if error
      await t.rollback();
      // throw error
      throw new ApolloError(error.message, "CAR_CREATE_ERROR_ROLLED_BACK");
    }
  }
  static async amendCar(carInputs, carUuid) {
    let { model, make, capacity, registrationNumber } = carInputs;

    // handle car input validations
    const { errors, isError } = validCarInputs(carInputs);
    if (isError) {
      throw new UserInputError("Car inputs invalid", errors);
    }

    const carToUpDate = await Car.findByPk(carUuid);
    if (!carToUpDate) {
      throw new ApolloError(
        "Car with that id does not exist",
        "CAR_DOES_NOT_EXIST"
      );
    }

    model = model ? model : carToUpDate.model;
    make = make ? make : carToUpDate.make;
    capacity = capacity ? capacity : carToUpDate.capacity;
    registrationNumber = registrationNumber
      ? registrationNumber
      : carToUpDate.registrationNumber;
    // start a transaction
    const t = await sequelize.transaction();

    try {
      const car = await Car.update(
        {
          model,
          make,
          capacity,
          registrationNumber,
        },
        { returning: true, where: { uuid: carUuid } },
        { transaction: t }
      );
      // commit the transaction if no error
      await t.commit();
      return {
        success: true,
        message: "Car successfully amended",
        car,
      };
    } catch (error) {
      // rollback the transaction if error
      await t.rollback();
      // throw error
      throw new ApolloError(error.message, "CAR_AMEND_ERROR_ROLLED_BACK");
    }
  }
  static async fetchAllMyCars(driver) {
    const t = await sequelize.transaction();
    try {
      const allCars = await Car.findAll({ where: { driver }, transaction: t });
      if (!allCars.length) {
        throw new ApolloError("There are no cars for now", "NO_EXISTING_CARS");
      }
      // commit the transaction if no error
      await t.commit();
      return allCars;
    } catch (error) {
      // rollback the transaction if error
      await t.rollback();
      // throw error
      throw new ApolloError(
        "An error occurred while fetching cars",
        "FETCHING_CARS_ERROR"
      );
    }
  }
  static async fetchAllCars() {
    const t = await sequelize.transaction();
    try {
      const allCars = await Car.findAll({ transaction: t });
      if (!allCars.length) {
        throw new ApolloError("There are no cars for now", "NO_EXISTING_CARS");
      }
      // commit the transaction if no error
      await t.commit();
      return allCars;
    } catch (error) {
      // rollback the transaction if error
      await t.rollback();
      // throw error
      throw new ApolloError(
        "An error occurred while fetching cars",
        "FETCHING_CARS_ERROR"
      );
    }
  }

  static async fetchCar(carUuid) {
    const t = await sequelize.transaction();
    try {
      const car = await Car.findByPk(carUuid, { transaction: t });
      if (!car) {
        throw new ApolloError("Car not found", "CAR_NOT_FOUND");
      }
      // commit the transaction if no error
      await t.commit();
      return car;
    } catch (error) {
      // rollback the transaction if error
      await t.rollback();
      // throw error
      throw new ApolloError(
        "An error occurred while fetching a car",
        "FETCHING_CAR_ERROR"
      );
    }
  }
}
export default CarController;
