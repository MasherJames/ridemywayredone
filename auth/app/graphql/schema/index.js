import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar Upload
  directive @formatDate(
    defaultFormat: String = "YYYY-MM-DD"
  ) on FIELD_DEFINITION

  directive @authenticated on FIELD_DEFINITION
  directive @authorized on FIELD_DEFINITION

  enum UserType {
    DRIVER
    PASSENGER
  }

  type User @key(fields: "uuid") {
    uuid: String!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String!
    isPhoneVerified: Boolean!
    isEmailVerified: Boolean!
    isAdmin: Boolean!
    userType: [UserType]!
    createdAt: String! @formatDate
    updatedAt: String! @formatDate
  }

  type Driver @key(fields: "uuid") {
    uuid: String!
    licenseNumber: String!
    ntsaNumber: String!
    createdAt: String! @formatDate
    updatedAt: String! @formatDate
    user: User
  }

  type Passenger @key(fields: "uuid") {
    uuid: String!
    nationalId: String!
    placeOfResidence: String!
    createdAt: String! @formatDate
    updatedAt: String! @formatDate
    user: User
  }

  type Profile {
    profilePicture: String
    userName: String
    middleNae: String
    address: String
    gender: String
    country: String
    createdAt: String! @formatDate
    updatedAt: String! @formatDate
    user: User!
  }

  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    phoneNumber: String!
    userType: [UserType]!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input DriverInput {
    licenseNumber: String!
    ntsaNumber: String!
  }

  input PassengerInput {
    nationalId: String!
    placeOfResidence: String!
  }

  input ProfileInput {
    profilePicture: Upload
    userName: String
    middleNae: String
    address: String
    gender: String
    country: String
  }

  type UserPayload {
    success: Boolean!
    message: String!
    token: String!
    user: User
  }

  type DriverPayload {
    success: Boolean!
    message: String!
    driver: Driver
  }

  type PassengerPayload {
    success: Boolean!
    message: String!
    passenger: Passenger
  }

  type ProfilePayload {
    success: Boolean!
    message: String!
    profile: Profile
  }

  type VerifyEmailOrPhonePayLoad {
    success: Boolean!
    message: String!
  }

  input EmailVerificationInput {
    verificationEmailToken: String!
  }

  input PhoneVerificationInput {
    phoneVerificationCode: Int!
  }

  type Query {
    allUsers: [User!]! @authorized
    getUser(uuid: String!): User! @authenticated
  }

  type Mutation {
    registerUser(input: UserInput!): UserPayload!
    login(input: LoginInput!): UserPayload
    verifyEmail(input: EmailVerificationInput!): VerifyEmailOrPhonePayLoad!
    verifyPhone(input: PhoneVerificationInput!): VerifyEmailOrPhonePayLoad!
    registerDriver(input: DriverInput!): DriverPayload! @authenticated
    registerPassenger(input: PassengerInput!): PassengerPayload! @authenticated
    updateProfile(input: ProfileInput): ProfilePayload! @authenticated
  }
`;

export default typeDefs;
