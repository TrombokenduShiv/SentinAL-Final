from rest_framework import serializers
from .models import Violation, Contract

class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = '__all__'


# Custom serializer to match frontend structure
class ViolationSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    location_code = serializers.SerializerMethodField()

    class Meta:
        model = Violation
        fields = [
            'id',
            'type',
            'asset_name',
            'location',
            'location_code',
            'timestamp',
            'html_hash',
            'status',
        ]

    def get_type(self, obj):
        # Map backend breach_type to frontend type
        if obj.breach_type == 'PIRACY':
            return 'PIRACY'
        elif obj.breach_type == 'TERRITORY':
            return 'TERRITORY'
        elif obj.breach_type:
            return obj.breach_type
        return ''

    def get_location_code(self, obj):
        # If location is a country code, return as is, else try to extract code
        if len(obj.location) == 2:
            return obj.location
        # Try to extract code from e.g. 'Russia (RU)'
        if '(' in obj.location and ')' in obj.location:
            return obj.location.split('(')[-1].replace(')','').strip()
        return obj.location

# SPECIAL SERIALIZER: For Alaukik's Crawler Payload
# This matches the specific JSON structure defined in the Tech Spec.
class CrawlerReportSerializer(serializers.Serializer):
    # Expects the nested object "scraped_data"
    scraped_data = serializers.JSONField()