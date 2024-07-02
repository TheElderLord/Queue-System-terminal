<template>
  <div id="app">
    <h1>Geolocation Example</h1>
    <div v-if="location">
      <p>Your Latitude: {{ location.latitude }}</p>
      <p>Your Longitude: {{ location.longitude }}</p>
      <p v-if="isInBuilding">You are in the building.</p>
      <p v-else>You are not in the building.</p>
    </div>
    <div v-else>
      <p>Loading location...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      location: null,
      building: {
        latitude: 43.360860,
        longitude: 76.982009,
      },
      isInBuilding: false,
      radius: 1500, // Radius in meters
    };
  },
  methods: {
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            this.checkIfInBuilding();
          },
          error => {
            console.error('Error getting location: ', error);
            alert('Unable to retrieve your location');
          }
        );
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    },
    toRadians(degrees) {
      return degrees * Math.PI / 180;
    },
    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371e3; // Radius of the Earth in meters
      const φ1 = this.toRadians(lat1);
      const φ2 = this.toRadians(lat2);
      const Δφ = this.toRadians(lat2 - lat1);
      const Δλ = this.toRadians(lon2 - lon1);

      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c; // Distance in meters
    },
    checkIfInBuilding() {
      const distance = this.calculateDistance(
        this.location.latitude,
        this.location.longitude,
        this.building.latitude,
        this.building.longitude
      );
      console.log(distance);
      console.log(this.radius);
      this.isInBuilding = distance <= this.radius;
    },
  },
  created() {
    this.getLocation();
  },
};
</script>

<style>
/* Add your styles here */
</style>
