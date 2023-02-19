import requests
import pandas as pd
import geopy
from geopy.geocoders import Nominatim
import urllib

url = r'https://nationalmap.gov/epqs/pqs.php?'

def get_elevation(lat, lon):
    params = {
        'x': lon,
        'y': lat,
        'units': 'Meters',
        'output': 'json'
    }
    result = requests.get((url + urllib.parse.urlencode(params)))
    return result.json()['USGS_Elevation_Point_Query_Service']['Elevation_Query']['Elevation']

def get_lat_long_alt(address:str):
    geolocator = Nominatim(user_agent="myGeocoder")
    location = geolocator.geocode(address)
    elevation = get_elevation(location.latitude, location.longitude)
    return location.latitude, location.longitude, elevation
