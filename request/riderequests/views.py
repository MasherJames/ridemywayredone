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
        return {
            "success": False,
            "message": "Error occured",
            "riderequest": None
        }


def all_ride_requests():
    return {}
