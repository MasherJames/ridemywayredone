import { validNames, validNumbers } from "./constants";

export default ({ model, make, capacity, registrationNumber }) => {
  const errors = {};
  if (model) {
    if (!validNames.test(model)) {
      errors.model = "Vehicle model should be valid";
    }
  }
  if (make) {
    if (!validNames.test(make)) {
      errors.make = "Vehicle make should be valid";
    }
  }
  if (capacity) {
    if (isNaN(capacity)) {
      errors.capacity = "Vehicle capacity should be a number";
    }
  }
  if (registrationNumber) {
    if (!validNames.test(registrationNumber)) {
      errors.registrationNumber = "Vehicle registration should be valid";
    }
  }

  return {
    errors,
    isError: Object.keys(errors).length > 0,
  };
};
