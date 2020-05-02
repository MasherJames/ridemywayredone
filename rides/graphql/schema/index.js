import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Car {
    make: String!
    model: String!
    registrationNumber: String!
    capacity: Int!
    driver: Driver
  }

  type Ride {
    origin: String!
    destination: String!
    departureTime: String!
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
    allCars: [Car]!
    allRide: [Ride]!
  }

  type Mutation {
    addCar(input: CarInput!): CarPayload!
    addRide(input: RideInput!): RidePayload!
  }
`;
export default typeDefs;
