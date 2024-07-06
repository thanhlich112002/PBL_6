require("dotenv").config();
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GEOCODER_PROVIDER = process.env.GEOCODER_PROVIDER;
const GEOCODER_KEY = process.env.GEOCODER_KEY;
const NodeGeocoder = require("node-geocoder");
var distance = require("google-distance-matrix");
const mapquest = require("mapquest");
const geolib = require("geolib");
const options = {
  provider: "google",
  apiKey: API_KEY,
  formatter: null,
};
const options2 = {
  provider: GEOCODER_PROVIDER,
  apiKey: GEOCODER_KEY,
  formatter: null,
};
const geocoder = NodeGeocoder(options);

class mapUtils {
  getGeoCode = async (address) => {
    return await geocoder
      .geocode(address)
      .then()
      .catch((err) => {
        const geocoder2 = NodeGeocoder(options2);
        return geocoder2.geocode(address);
      });
  };
  getAddress = async (latlng) => {
    const obj = { lat: +latlng.split(",")[0], lon: +latlng.split(",")[1] };
    return await geocoder
      .reverse(obj)
      .then()
      .catch((err) => {
        const geocoder2 = NodeGeocoder(options2);
        return geocoder2.geocode(address);
      });
  };
  getDistance = (origin, destination) => {
    return geolib.getDistance(origin, destination);
  };
  // search = async (location, radius) => {
  //   location = await getGeoCode(location);
  //   const url = `https://maps.googleapis.com/maps/api/place//nearbysearch/json?location=${location}&radius${radius}&key=${API_KEY}`;
  //   const result = await axios.get(url);
  //   if (result.data.status === "OK") {
  //     return result.data;
  //   }
  // };
  // getDistanceAndDuration = async (origin, destination) => {
  //   const url = `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=k81Heb1ZE5HLwWebiZTzQEbgdRqi5iFCY6Z8h0KnDAJgWddVh9BngcTLJwYMXx69`;
  //   const result = await axios.get(url);
  //   if (result.data.status === "OK") {
  //     const distance = result.data.rows[0].elements[0].distance.text.split(" ");
  //     const duration = result.data.rows[0].elements[0].duration.text.split(" ");
  //     return [
  //       distance[1] === "km"
  //         ? parseFloat(distance[0])
  //         : parseFloat(distance[0]) / 1000,
  //       duration.length == 4
  //         ? parseFloat(duration[0]) * 60 + parseFloat(duration[2])
  //         : parseFloat(duration[0]),
  //     ];
  //   }
  // };
}
module.exports = new mapUtils();
