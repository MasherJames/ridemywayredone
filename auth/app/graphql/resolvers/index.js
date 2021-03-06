import authResolvers from "./auth";
import driverResolvers from "./driver";
import passengerResolvers from "./passenger";
import profileResolvers from "./profile";
import { mergeResolvers } from "../../utils";

export default mergeResolvers(
  authResolvers,
  driverResolvers,
  passengerResolvers,
  profileResolvers
);
