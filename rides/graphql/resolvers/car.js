import CarController from "../../controllers/car";

export default {
  Mutation: {
    addCar: async (_, { input }, { user: { driver } }) => {
      const response = await CarController.addCar(input, driver);
      return response;
    },
    amendCar: async (_, { input, uuid }) => {
      const response = await CarController.amendCar(input, uuid);
      return response;
    },
  },
  Query: {
    allMyCars: async (_, _, { user: { driver } }) => {
      const response = await CarController.fetchAllMyCars(driver);
      return response;
    },
    allCars: async () => {
      const response = await CarController.fetchAllCars();
      return response;
    },
    singleCar: async (_, { uuid }) => {
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
