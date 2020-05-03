import CarController from "../../controllers/car";

export default {
  Mutation: {
    addCar: async (parent, { input }, { user: { uuid } }, info) => {
      const response = await CarController.addCar(input, uuid);
      return response;
    },
    amendCar: async (parent, { input, uuid }, ctx, info) => {
      const response = await CarController.amendCar(input, uuid);
      return response;
    },
  },
  Query: {
    allMyCars: async (parent, args, { user: { uuid } }, info) => {
      const response = await CarController.fetchAllMyCars(uuid);
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
      return { __typename: "Driver", uuid: car.uuid };
    },
  },
  Driver: {
    cars: async (driver) => {
      const response = await CarController.fetchAllMyCars(driver.uuid);
      return response;
    },
  },
};
