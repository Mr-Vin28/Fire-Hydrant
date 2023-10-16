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
  
    calculateAndDisplayRoute(destinationLatLng) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
          const currentLatLng = L.latLng(position.coords.latitude, position.coords.longitude);
          this.clearExistingRoutes();
  
          L.Routing.control({
            waypoints: [
              L.latLng(currentLatLng.lat, currentLatLng.lng),
              L.latLng(destinationLatLng.lat, destinationLatLng.lng),
            ],
            routeWhileDragging: true,
          }).addTo(this.map);
        });
      } else {
        alert('Geolocation is not available in your browser.');
      }
    }
  
    clearExistingRoutes() {
      this.map.eachLayer(layer => {
        if (layer instanceof L.Polyline) {
          this.map.removeLayer(layer);
        }
      });
    }
  }
  
  class MapManager {
    constructor(mapElementId) {
      this.mapHandler = new MapHandler();
      this.mapHandler.initializeMap();
      this.mapHandler.createFireHydrantIcon();
      this.map = this.mapHandler.map;
      this.addRightClickListener();
    }
  
    popupButtonClick(event) {
      const checkRadius = 100; // 100 meters
      const nearbyHydrants = [];
    
      // Create a LatLng object for the clicked point
      const clickedLatLng = L.latLng(event.latlng.lat, event.latlng.lng);
    
      // Iterate through all the hydrant markers on the map
      this.map.eachLayer(layer => {
        if (layer instanceof L.Marker && layer.options.icon === this.mapHandler.fireHydrantIcon) {
          const distance = L.GeometryUtil.distance(this.map, clickedLatLng, layer.getLatLng());
          if (distance <= checkRadius) {
            nearbyHydrants.push(layer);
          }
        }
      });
    
      if (nearbyHydrants.length > 0) {
        // There are nearby hydrants, show a message to the user
        alert('Unable to add hydrant here. There is a hydrant within 100 meters.');
      } else {
        // No nearby hydrants, allow the user to submit the form
        this.showForm(event.latlng);
      }
    }
    
  
    showForm(latlng) {
      var formLat = latlng.lat.toFixed(6);
      var formLng = latlng.lng.toFixed(6);

      // Create a form element and handle the form submission
      const form = document.createElement('form');
      form.id = 'hydrantForm';

      // Create input fields and add them to the form
      form.innerHTML = `  
              <label for="address">Address:</label>
              <input type="text" id="address" name="address" required><br><br>
      
              <label for="pressure">Pressure:</label>
              <input type="text" id="pressure" name="pressure" required><br><br>
      
              <label for="pipeType">Pipe Type:</label>
              <input type="text" id="pipeType" name="pipeType" required><br><br>
      
              <label for="valve">Valve:</label>
              <input type="text" id="valve" name="valve" required><br><br>
      
              <label for="color">Color:</label>
              <input type="text" id="color" name="color" required><br><br>
      
              <input type="submit" value="Submit">
          `;
      // Create a popup and set its content to the form
      const popup = L.popup({
        closeButton: false,
        className: 'custom-popup',
      })
        .setLatLng(event.latlng)
        .setContent(form)
        .openOn(this.map);
      // Handle the form submission
      form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the form from actually submitting

        // Example: Create a marker at the submitted location
        const hydrantIcon = L.icon({
          iconUrl: 'image/firehydrant.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        const hydrantMarker = L.marker([event.latlng.lat, event.latlng.lng], { icon: hydrantIcon }).addTo(this.map);

        // Close the popup after submitting
        this.map.closePopup();
      });
    }
  
    addRightClickListener() {
      this.map.on('contextmenu', (event) => {
        // Create a button for the popup and handle the button click
        const button = document.createElement('button');
        button.id = 'popupButton';
        button.textContent = 'Add Hydrant';
        button.style.border = 'none';
        button.style.backgroundColor = 'transparent';
        button.style.color = '#0077ff';
        button.style.cursor = 'pointer';
  
        button.addEventListener('mouseenter', () => {
          button.style.textDecoration = 'underline';
        });
  
        button.addEventListener('mouseleave', () => {
          button.style.textDecoration = 'none';
        });
  
        // Pass the event object to popupButtonClick
        button.addEventListener('click', () => this.popupButtonClick(event));
  
        // Create and open the popup with the button
        const popup = L.popup({
          closeButton: false,
          className: 'custom-popup',
        })
          .setLatLng(event.latlng || [0, 0])
          .setContent(button)
          .openOn(this.map);
      });
    }
  }
  
  // Create an instance of the MapManager class
  const mapManager = new MapManager('map');
  
  // Fetch data and add markers (assuming you have data available)
  fetch('connection.php') // Replace with your backend script URL
    .then(response => response.json())
    .then(data => {
      mapManager.mapHandler.addMarkers(data);
    })
    .catch(error => console.error('Error fetching data:', error));
  