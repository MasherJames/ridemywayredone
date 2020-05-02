import { validNames } from "./constants";

export default ({ licenseNumber, ntsaNumber }) => {
  const errors = {};
  if (!validNames.test(licenseNumber)) {
    errors.licenseNumber = "License number should be valid";
  }
  if (!validNames.test(ntsaNumber)) {
    errors.ntsaNumber = "Ntsa number should be valid";
  }

  return {
    errors,
    isError: Object.keys(errors).length > 0,
  };
};
