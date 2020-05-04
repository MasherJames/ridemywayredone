import { SchemaDirectiveVisitor, AuthenticationError } from "apollo-server";
import { GraphQLString, defaultFieldResolver } from "graphql";

import formatDate from "../../utils/date";

class FormatDateDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const { defaultFormat } = this.args;

    // push a new argument to be passed to the field resolver
    field.args.push({
      name: "format",
      type: GraphQLString,
    });

    // triggering the field resolver
    field.resolve = async (parent, { format, ...otherArgs }, ctx, info) => {
      // resolver to populate data for the date field
      const date = await resolve.call(this, parent, otherArgs, ctx, info);
      // If a format argument was not provided, default to the optional
      // defaultFormat argument taken by the @formatDate directive
      return formatDate(date, format || defaultFormat);
    };

    // The formatted Date becomes a String, so the field type must change if it was not a string
    field.type = GraphQLString;
  }
}

class AuthenticationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = async (parent, args, ctx, info) => {
      if (!ctx.user) {
        throw new AuthenticationError(
          "User must be authenticated",
          "USER_AUTHENTICATION_ERROR"
        );
      }

      return resolve(parent, args, ctx, info);
    };
  }
}

class AuthorizationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = async (parent, args, ctx, info) => {
      if (!ctx.user.isAdmin) {
        throw new AuthenticationError(
          "You can't access this level",
          "NON_ADMIN_ERROR"
        );
      }
      return resolve(parent, args, ctx, info);
    };
  }
}

export { FormatDateDirective, AuthenticationDirective, AuthorizationDirective };
