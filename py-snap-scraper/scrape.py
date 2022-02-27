from calendar import c
import requests
import json
from tqdm import tqdm
import time

import urllib

API_BASE = "https://ms.sc-jpl.com/web/"
LATEST_TILESET_API = API_BASE + "getLatestTileSet"
PLAYLIST_API = API_BASE + "getPlaylist"

headers = {'Content-type': 'application/json'}

def get_epoch():
    result = requests.get(LATEST_TILESET_API, headers=headers)
    result.raise_for_status()
    epochs = [info['id']['epoch'] for info in result.json()['tileSetInfos'] if info['id']['type'] == 'HEAT']
    assert len(epochs) == 1

    return int(epochs[0])

epoch = get_epoch()

def get_playlist(lat, lon, radius=10000, zoom=10):
    request_body = dict(
      requestGeoPoint=dict(lat=lat, lon=lon),
      zoomLevel=zoom,
      tileSetId=dict(flavor="default", epoch=int(epoch), type=1),
      radiusMeters=radius,
      maximumFuzzRadius=0,
    )


    result = requests.post(PLAYLIST_API, json=request_body, headers=headers)
    result.raise_for_status()

    elements = result.json()['manifest']['elements']

    return elements



import os
os.makedirs("videos", exist_ok=True)

with open("saved.json", "a") as out_file:
    with open('points.json') as json_file:
        data = json.load(json_file)
        for p in tqdm(data[1069 + 1033 + 959 + 264 + 619+1043:]):
            # sleep for 500ms
            time.sleep(1.1)
            playlist = get_playlist(p['lat'], p['lon'])

            start = time.time()

            for p in playlist:
                if 'prefixUrl' not in p['snapInfo']['streamingMediaInfo']:
                    continue
                url = p['snapInfo']['streamingMediaInfo']['prefixUrl'] + "media.mp4"
                # download the MP4  from url and save to file with urllib
                urllib.request.urlretrieve(url, "./videos/" + p['id'] + ".mp4")

            print(f"Downloaded {len(playlist)} videos in {time.time() - start}s")
            out_file.write(json.dumps(playlist) + "\n")
            