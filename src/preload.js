// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  minimize: () => ipcRenderer.send("minimize-window"),
  close: () => ipcRenderer.send("close-window"),
  fetchData: (url) => ipcRenderer.invoke("fetch-data", url),
  findAccount: (data) => ipcRenderer.invoke("find-account", data),
  uploadBike: (data) => ipcRenderer.invoke("upload-bike", data),
  fetchBikes: () => ipcRenderer.invoke("fetch-allbikes"),
  loadUser: (myID) => ipcRenderer.invoke("load-admin", myID),
  updateUser: (myID, data) => ipcRenderer.invoke("update-account", myID, data),
  sendOTP: (data) => ipcRenderer.invoke("send-otpmail", data),
  updatePass: (myID, data) => ipcRenderer.invoke("update-pass", myID, data),
  ADMINcheck: (data) => ipcRenderer.invoke("check-duplicates", data),
  ADMINcreate: (data) => ipcRenderer.invoke("create-admin", data),
  ADMINsentemail: (data) => ipcRenderer.invoke("sendEmail-Admin", data),
  getReservations: () => ipcRenderer.invoke("get-reservations"),
  getReservationsALL: () => ipcRenderer.invoke("get-reservations-all"),
  getReservationsFIVE: () => ipcRenderer.invoke("get-reservations-five"),
  updateToRent: (reservationId, data) => ipcRenderer.invoke("status-to-rent", reservationId, data),
  updateToVacant: (reservationId, data) => ipcRenderer.invoke("status-to-vacant", reservationId, data),
  loadGoogleMaps: () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA0QEm532dmx9umd3aObSmmjqh1S0udZ0k&callback=initMap`;
      script.async = true;
      script.defer = true;
      window.initMap = () => {
        resolve(); // Resolve the promise when the map is ready
      };
      script.onerror = () => {
        reject(new Error("Failed to load Google Maps API"));
      };
      document.head.appendChild(script);
    });
  },
});

ipcRenderer.on("account-found", (event, response) => {
  window.dispatchEvent(new CustomEvent("account-found", { detail: response }));
});

ipcRenderer.on("bike-uploaded", (event, response) => {
  window.dispatchEvent(new CustomEvent("bike-uploaded", { detail: response }));
});
