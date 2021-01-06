import RideController from "../../controllers/ride";
import CarController from "../../controllers/car";

export default {
  Mutation: {
    addRide: async (_, { input }, { user: { driver } }) => {
      const response = await RideController.addRide(input, driver);
      return response;
    },
    amendRide: async (_, { input, uuid }) => {
      const response = await RideController.amendRide(input, uuid);
      return response;
    },
  },
  Query: {
    allRides: async () => {
      const response = await RideController.fetchAllRides();
      return response;
    },
    allMyRides: async (_, _, { user: { driver } }) => {
      const response = await RideController.fetchAllMyRides(driver);
      return response;
    },
    singleRide: async (_, { uuid }) => {
      const response = await RideController.fetchRide(uuid);
      return response;
    },
  },
  Ride: {
    car: async (ride) => {
      const response = await CarController.fetchCar(ride.carId);
      return response;
    },
    __resolveReference: async (reference) => {
      const response = await RideController.fetchRide(reference.uuid);
      return response;
    },
  },
};
