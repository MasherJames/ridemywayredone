import CarController from "../../controllers/car";

export default {
  Mutation: {
    addCar: async (parent, { input }, { user: { driver } }, info) => {
      const response = await CarController.addCar(input, driver);
      return response;
    },
    amendCar: async (parent, { input, uuid }, ctx, info) => {
      const response = await CarController.amendCar(input, uuid);
      return response;
    },
  },
  Query: {
    allMyCars: async (parent, args, { user: { driver } }, info) => {
      const response = await CarController.fetchAllMyCars(driver);
      return response;
    },
    allCars: async (parent, args, ctx, info) => {
      const response = await CarController.fetchAllCars();
      return response;
    },
    singleCar: async (parent, { uuid }, ctx, info) => {
      const response = await CarController.fetchCar(uuid);
      return response;
    },
  },
  Car: {
    driver(car) {
      return { __typename: "Driver", uuid: car.driver };
    },
  },
  Driver: {
    cars: async (driver) => {
      const response = await CarController.fetchAllMyCars(driver.uuid);
      return response;
    },
  },
};
