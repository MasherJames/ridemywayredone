import { validNames, validPhone, validEmail, validPassword } from "./constants";

export default ({
  firstName,
  lastName,
  email,
  password,
  phoneNumber,
  userType,
}) => {
  const errors = {};
  if (!validNames.test(firstName)) {
    errors.firstName =
      "First name should be alphanumeric and minimum 2 characters";
  }
  if (!validNames.test(lastName)) {
    errors.lastName =
      "Last name should be alphanumeric and minimum 2 characters";
  }
  if (!validEmail.test(email)) {
    errors.email = "Email should be valid";
  }
  if (!validPhone.test(phoneNumber)) {
    errors.phoneNumber = "Phone number should be valid";
  }
  if (!validPassword.test(password)) {
    errors.password = "Password should be valid";
  }
  if (userType[0] !== 1 && userType[0] !== 2) {
    errors.userType = "User type should be valid";
  }

  return {
    errors,
    isError: Object.keys(errors).length > 0,
  };
};
