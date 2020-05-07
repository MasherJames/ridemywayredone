import uuid
from django.db import models
from django.core.validators import MinValueValidator


class RideRequest(models.Model):
    uuid = models.UUIDField(primary_key=True,
                            default=uuid.uuid4, editable=False)
    compensation = models.DecimalField(
        max_digits=6, decimal_places=2, null=True,
        blank=True, validators=[MinValueValidator(0)])
    passenger = models.UUIDField()
    ride = models.UUIDField()
