import carResolver from "./car";
import rideResolver from "./rides";
import mergeResolvers from "../../utils/mergeResolvers";

export default mergeResolvers(carResolver, rideResolver);
