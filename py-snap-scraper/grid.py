from shapely.geometry import MultiPolygon, Polygon, box, MultiPoint, Point
from shapely import wkt

def get_geometries(top_left, bottom_right, spacing=0.08):
    polygons = []
    points = []
    xmin = top_left[0]
    xmax = bottom_right[0]
    ymax = top_left[1]
    y = bottom_right[1]
    i = -1
    while True:
        if y > ymax:
            break
        x = xmin

        while True:
            if x > xmax:
                break
            
            #components for polygon grid
            polygon = box(x, y, x+spacing, y+spacing)
            polygons.append(polygon)

            #components for point grid
            point = Point(x, y)
            points.append(point)
            i = i + 1
            x = x + spacing

        y = y + spacing
    return polygons, points

polygons, points = get_geometries((14, 54), (24, 49), 0.5)

##country_geom is a shapely polygon with country boundaries
country_geom = wkt.loads('POLYGON((17.564247434051406 54.446991320181255,16.311806027801406 54.061910892199705,15.575722043426405 53.37933926382691,15.377968137176405 52.79871812523439,15.575722043426405 51.98076121960815,15.619667355926405 51.15448239676194,16.696327512176406 50.94037053252475,17.871864621551406 50.47422670556861,18.761757199676406 50.27102433369101,21.54709245171919 50.3018762188395,22.28317643609419 50.31590902034586,23.19504167046919 51.019189209157204,22.65671159234419 52.08481472438036,22.79953385796919 52.86108007657073,22.48237015280161 53.76537437170607,22.24067093405161 54.11458487224089,20.402314605750536 54.24318115411181,18.908173980750536 54.09526092933704,18.007295074500536 54.396969300395,17.564247434051406 54.446991320181255))')

intersecting_polygons = []
intersecting_points = []
for polygon in polygons:
    if polygon.intersects(country_geom):
        intersecting_polygons.append(polygon)

for point in points:
    if country_geom.contains(point):
        intersecting_points.append(point)

polygon_grid = MultiPolygon(intersecting_polygons)
point_grid = MultiPoint(intersecting_points)

#grids are shapely geometries. You can output them as WKT format
print(point_grid.wkt)
print(polygon_grid.wkt)
