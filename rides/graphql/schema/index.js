import { gql } from "apollo-server";

const typeDefs = gql`
  directive @formatDate(
    defaultFormat: String = "YYYY-MM-DD"
  ) on FIELD_DEFINITION
  directive @authenticated on FIELD_DEFINITION
  directive @authorized on FIELD_DEFINITION
  directive @authorizeDriver on FIELD_DEFINITION

  type Car {
    uuid: String!
    make: String!
    model: String!
    registrationNumber: String!
    capacity: Int!
    createdAt: String! @formatDate
    updatedAt: String! @formatDate
    driver: Driver
  }

  extend type Driver @key(fields: "uuid") {
    uuid: String! @external
    cars: [Car]!
  }

  type Ride @key(fields: "uuid") {
    uuid: String!
    origin: String!
    destination: String!
    departureTime: String!
    createdAt: String! @formatDate
    updatedAt: String! @formatDate
    car: Car!
  }

  input CarInput {
    make: String!
    model: String!
    registrationNumber: String!
    capacity: Int!
  }

  input RideInput {
    origin: String!
    destination: String!
    departureTime: String!
    car: String!
  }

  input AmendCarInput {
    make: String
    model: String
    registrationNumber: String
    capacity: Int
  }

  input AmendRideInput {
    origin: String
    destination: String
    departureTime: String
    car: String
  }

  type CarPayload {
    success: Boolean!
    message: String!
    car: Car
  }

  type RidePayload {
    success: Boolean!
    message: String!
    ride: Ride
  }

  type Query {
    allCars: [Car!]! @authenticated @authorized
    allMyCars: [Car!]! @authenticated
    singleCar(uuid: String!): Car! @authenticated
    allRides: [Ride!]! @authenticated @authorized
    allMyRides: [Ride!]! @authenticated
    singleRide(uuid: String!): Ride! @authenticated
  }

  type Mutation {
    addCar(input: CarInput!): CarPayload! @authenticated @authorizeDriver
    amendCar(input: AmendCarInput!): CarPayload! @authenticated @authorizeDriver
    addRide(input: RideInput!): RidePayload! @authenticated @authorizeDriver
    amendRide(input: AmendRideInput!): RidePayload!
      @authenticated
      @authorizeDriver
  }
`;
export default typeDefs;
