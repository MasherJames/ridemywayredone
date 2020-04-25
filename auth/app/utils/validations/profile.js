import { validNames, validUrl } from "./constants";

export default ({ userName, middleNae, address, gender, country }) => {
  const errors = {};

  if (userName) {
    if (!validNames.test(userName)) {
      errors.userName = "Username should be valid";
    }
  }
  if (middleNae) {
    if (!validNames.test(middleNae)) {
      errors.middleName = "Middle name should be valid";
    }
  }
  if (gender) {
    if (!validNames.test(gender)) {
      errors.gender = "Gender should be valid";
    }
  }
  if (address) {
    if (!validNames.test(address)) {
      errors.address = "Address should be valid";
    }
  }
  if (country) {
    if (!validNames.test(country)) {
      errors.country = "Country should be valid";
    }
  }

  return {
    errors,
    isError: Object.keys(errors).length > 0,
  };
};
