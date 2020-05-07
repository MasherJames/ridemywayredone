from ariadne.asgi import GraphQL
from ariadne import (load_schema_from_path,
                     make_executable_schema, MutationType, QueryType)
from ariadne.contrib.federation import (
    FederatedObjectType, make_federated_schema)
from . import resolvers
# from .models import RideRequest

# load schema file
type_defs = load_schema_from_path("riderequests/schema.graphql")

mutation = MutationType()
query = QueryType()
riderequest = FederatedObjectType("RideRequest")

mutation.set_field("requestRide", resolvers.resolve_request_ride)
query.set_field("allRideRequests", resolvers.resolve_all_ride_request)
riderequest.set_field("passenger", resolvers.resolve_riderequest_passenger)
riderequest.set_field("ride", resolvers.resolve_riderequest_ride)

# bind schema(queries and mutation) to the respective resolvers
schema = make_federated_schema(type_defs, [riderequest, query, mutation])
application = GraphQL(schema, debug=True)
