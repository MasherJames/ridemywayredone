import RideController from "../../controllers/ride";
import CarController from "../../controllers/car";

export default {
  Mutation: {
    addRide: async (parent, { input }, { user: { driver } }, info) => {
      const response = await RideController.addRide(input, driver);
      return response;
    },
    amendRide: async (parent, { input, uuid }, ctx, info) => {
      const response = await RideController.amendRide(input, uuid);
      return response;
    },
  },
  Query: {
    allRides: async (parent, args, ctx, info) => {
      const response = await RideController.fetchAllRides();
      return response;
    },
    allMyRides: async (parent, args, { user: { driver } }, info) => {
      const response = await RideController.fetchAllMyRides(driver);
      return response;
    },
    singleRide: async (parent, { uuid }, ctx, info) => {
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
      console.log(reference);
      const response = await RideController.fetchRide(reference.uuid);
      return response;
    },
  },
};
