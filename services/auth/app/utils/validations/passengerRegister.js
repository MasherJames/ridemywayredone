import { validNames, validNumbers } from "./constants";

export default ({ nationalId, placeOfResidence }) => {
  const errors = {};
  if (!validNumbers.test(nationalId)) {
    errors.nationalId = "National Id should be valid";
  }
  if (!validNames.test(placeOfResidence)) {
    errors.placeOfResidence = "Enter valid place of residence should be valid";
  }

  return {
    errors,
    isError: Object.keys(errors).length > 0,
  };
};
