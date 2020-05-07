import json
from . import views


def resolve_request_ride(_, info, input):
    passenger = json.loads(info.context.headers["User"])["passenger"]

    request_inputs = {
        "compensation": input["compensation"],
        "ride": input["ride"],
        "passenger": passenger
    }
    response = views.request_ride(request_inputs)
    return response


def resolve_riderequest_ride(riderequest, *_):
    return {"__typename": "Ride", "uuid": riderequest.ride}


def resolve_riderequest_passenger(riderequest, *_):
    return {"__typename": "Passenger", "uuid": riderequest.passenger}


def resolve_all_ride_request(*_):
    response = views.all_ride_requests()
    return response
