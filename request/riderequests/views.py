import sys
from django.shortcuts import render
from django.db import transaction
from .models import RideRequest


def request_ride(request_inputs):
    try:
        with transaction.atomic():
            ride_req = RideRequest.objects.create(compensation=request_inputs["compensation"],
                                                  passenger=request_inputs["passenger"],
                                                  ride=request_inputs["ride"],
                                                  )
            # Send the driver an email that a ride under his name has been requested
            return {
                "success": True,
                "message": "Ride successfully requested",
                "riderequest": ride_req
            }
    except:
        print(sys.exc_info()[0])
        return {
            "success": False,
            "message": f'Error: {sys.exc_info()[0]}. {sys.exc_info()[1]}',
            "riderequest": None
        }


def all_ride_requests(filters):
    try:
        with transaction.atomic():
            queryset = RideRequest.objects.all()
            if len(queryset) == 0:
                return []
            if filters.items():
                for key, value in filters.items():
                    queryset = queryset.filter(**{key: value})
            return queryset
    except:
        print(f'Error: {sys.exc_info()[0]}. {sys.exc_info()[1]}')
        return []


def single_ride_request(uuid):
    try:
        with transaction.atomic():
            ride_req = RideRequest.objects.get(uuid=uuid)
            print(ride_req)
            if not ride_req:
                ride_req = {}
            return ride_req
    except:
        print(f'Error: {sys.exc_info()[0]}. {sys.exc_info()[1]}')
        return {}
