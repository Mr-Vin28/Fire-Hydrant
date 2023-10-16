<!DOCTYPE html>
<html>
<head>
    <title>OpenStreetMap in Laravel</title>
    <!-- <link rel="stylesheet" href="{{ asset('node_modules/leaflet/dist/leaflet.css') }}">
     -->

    <script src="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.min.css">

    <!-- <link rel="stylesheet" href="{{ mix('css/app.css') }}">
    <script src="{{ mix('js/app.js') }}"></script> -->



    <style>
        #map { height: 800px; }
    </style>
</head>
<body>
    <div id="map"></div>
    <!-- <script src="{{ asset('node_modules/leaflet/dist/leaflet.js') }}"></script> -->
    <!-- <script>
        var map = L.map('map').setView([14.247142, 121.136673], 13.5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);
    </script> -->

<script>

    class MapHandler {
        constructor() {
            this.map = null;
            this.fireHydrantIcon = null;
        }
    
        initializeMap() {
            this.map = L.map('map').setView([14.247142, 121.136673], 13.5);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
        }
    
        createFireHydrantIcon() {
            this.fireHydrantIcon = L.icon({
                iconUrl: 'image/cabwadhydrant.png',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32],
            });
        }

        addMarkers(data) {
            data.forEach(location => {
                L.marker([location.latitude, location.longitude], { icon: this.fireHydrantIcon })
                .addTo(this.map)
                .bindPopup(location.address);
            });
        }
    }

    class MapManager {
        constructor(mapElementId) {
            this.mapHandler = new MapHandler();
            this.mapHandler.initializeMap();
            this.mapHandler.createFireHydrantIcon();
            this.map = this.mapHandler.map;
            // this.addRightClickListener();
        }
    }

    
    // Create an instance of the MapManager class
    const mapManager = new MapManager('map');
</script>
</body>
</html>
