import axios from "axios";

export const searchPlacesApi = (text, location) => {
  return new Promise((resolve, reject) => {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${"AIzaSyAvMJQfSi7KEWnICftMup-QuqjEcSIGgp0"}&sessiontoken=1234567890&location=${
      location?.latitude
    },${location?.longitude}&radius=16000`;
    axios.get(url).then((response) => {
      if (response.data.status == "OK") {
        resolve(response.data.predictions.slice(0, 3));
      }
    });
  });
};
export const getLatLongFromPlaceName = (address) => {
  return new Promise((resolve, reject) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${"AIzaSyAvMJQfSi7KEWnICftMup-QuqjEcSIGgp0"}`;
    axios.get(url).then((response) => {
      if (response.data.status == "OK") resolve(response.data.results[0]);
    });
  });
};
