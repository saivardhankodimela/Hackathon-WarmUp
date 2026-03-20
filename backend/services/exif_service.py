from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
from io import BytesIO
from typing import Optional

def get_exif_gps(image_bytes: bytes) -> Optional[dict]:
    """
    Extracts GPS Latitude and Longitude from image EXIF metadata.
    """
    try:
        image = Image.open(BytesIO(image_bytes))
        exif = image._getexif()
        if not exif:
            return None
        
        gps_info = {}
        for tag, value in exif.items():
            decoded = TAGS.get(tag, tag)
            if decoded == "GPSInfo":
                # value is a dictionary containing GPSTAGS
                for t in value:
                    sub_decoded = GPSTAGS.get(t, t)
                    gps_info[sub_decoded] = value[t]
        
        if not gps_info:
            return None
            
        def convert_to_degrees(value):
            """
            Converts EXIF degree tuple (d, m, s) to decimal degrees.
            """
            d = float(value[0])
            m = float(value[1]) / 60.0
            s = float(value[2]) / 3600.0
            return d + m + s

        # Validate that required keys are present
        if 'GPSLatitude' not in gps_info or 'GPSLongitude' not in gps_info:
            return None

        lat = convert_to_degrees(gps_info['GPSLatitude'])
        lon = convert_to_degrees(gps_info['GPSLongitude'])
        
        # Check directions (N/S, E/W)
        if gps_info.get('GPSLatitudeRef', 'N') == 'S':
            lat = -lat
        if gps_info.get('GPSLongitudeRef', 'E') == 'W':
            lon = -lon
            
        return {"latitude": lat, "longitude": lon}
    except Exception as e:
        print(f"EXIF Extraction Warning: {e}")
        return None
