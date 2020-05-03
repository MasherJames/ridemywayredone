import { validNames } from "./constants";

export default (origin, destination, departureTime) => {
  const errors = {};
  if (origin) {
    if (!validNames.test(origin)) {
      errors.origin = "Ride origin should be valid";
    }
  }
  if (destination) {
    if (!validNames.test(destination)) {
      errors.destination = "Ride destination should be valid";
    }
  }
  if (departureTime) {
    if (!validNames.test(departureTime)) {
      errors.departureTime = "Departure time should be valid";
    }
  }

  return {
    errors,
    isError: Object.keys(errors).length > 0,
  };
};
