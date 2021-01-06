import models from "../db/models";
import { validCarInputs, ErrorHandler } from "../utils";

const Car = models.Car;
const sequelize = models.sequelize;

class CarController {
  static async addCar(carInput, driver) {
    const { model, make, capacity, registrationNumber } = carInput;

    // handle user input validations
    const { errors, isError } = validCarInputs(carInput);
    if (isError) {
      ErrorHandler.userInputError("Car inputs invalid", errors);
    }

    const existingVehicleWithSameRegNo = await Car.findOne({
      where: { registrationNumber },
    });

    if (existingVehicleWithSameRegNo) {
      ErrorHandler.apolloError(
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
        message: "Car successfully added",
        car,
      };
    } catch (error) {
      // rollback the transaction if error
      await t.rollback();
      // throw error
      ErrorHandler.apolloError(error.message, "CAR_CREATE_ERROR_ROLLED_BACK");
    }
  }
  static async amendCar(carInputs, carUuid) {
    let { model, make, capacity, registrationNumber } = carInputs;

    // handle car input validations
    const { errors, isError } = validCarInputs(carInputs);
    if (isError) {
      ErrorHandler.userInputError("Car inputs invalid", errors);
    }

    const carToUpDate = await Car.findByPk(carUuid);
    if (!carToUpDate) {
      ErrorHandler.apolloError(
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
      ErrorHandler.apolloError(error.message, "CAR_AMEND_ERROR_ROLLED_BACK");
    }
  }
  static async fetchAllMyCars(driver) {
    const t = await sequelize.transaction();
    try {
      const allCars = await Car.findAll({ where: { driver }, transaction: t });
      if (allCars.length === 0) {
        return { message: "There are no cars for now" };
      }
      // commit the transaction if no error
      await t.commit();
      return allCars;
    } catch (error) {
      // rollback the transaction if error
      await t.rollback();
      // throw error
      ErrorHandler.apolloError(error.message, "FETCHING_CARS_ERROR");
    }
  }
  static async fetchAllCars() {
    const t = await sequelize.transaction();
    try {
      const allCars = await Car.findAll({ transaction: t });
      if (allCars.length === 0) {
        return { message: "There are no cars for now" };
      }
      // commit the transaction if no error
      await t.commit();
      return allCars;
    } catch (error) {
      // rollback the transaction if error
      await t.rollback();
      // throw error
      ErrorHandler.apolloError(error.message, "FETCHING_CARS_ERROR");
    }
  }

  static async fetchCar(carUuid) {
    const t = await sequelize.transaction();
    try {
      const car = await Car.findByPk(carUuid, { transaction: t });
      if (!car) {
        return { message: "Car not found" };
      }
      // commit the transaction if no error
      await t.commit();
      return car;
    } catch (error) {
      // rollback the transaction if error
      await t.rollback();
      // throw error
      ErrorHandler.apolloError(error.message, "FETCHING_CAR_ERROR");
    }
  }
}
export default CarController;
