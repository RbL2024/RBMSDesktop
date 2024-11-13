// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    minimize: () => ipcRenderer.send('minimize-window'),
    close: () => ipcRenderer.send('close-window'),
    fetchData: (url) => ipcRenderer.invoke('fetch-data', url),
    findAccount: (data) => ipcRenderer.invoke('find-account', data),
    uploadBike: (data) => ipcRenderer.invoke('upload-bike', data),
    fetchBikes: () =>  ipcRenderer.invoke('fetch-allbikes'),
    loadUser: (myID) => ipcRenderer.invoke('load-admin', myID),
    updateUser: (myID, data)  => ipcRenderer.invoke('update-account', myID, data),
    sendOTP: (data)  => ipcRenderer.invoke('send-otpmail', data),
    updatePass: (myID, data) =>  ipcRenderer.invoke('update-pass', myID, data),
    ADMINcheck: (data)  => ipcRenderer.invoke('check-duplicates', data),
    ADMINcreate: (data) => ipcRenderer.invoke('create-admin', data),
    ADMINsentemail: (data) => ipcRenderer.invoke('sendEmail-Admin', data),
    getReservations: () => ipcRenderer.invoke('get-reservations'),
    getReservationsALL: () => ipcRenderer.invoke('get-reservations-all'),
    getReservationsFIVE: () => ipcRenderer.invoke('get-reservations-five'),
    updateToRent: (reservationId, data) => ipcRenderer.invoke('status-to-rent', reservationId, data),
    updateToVacant: (reservationId, data) => ipcRenderer.invoke('status-to-vacant', reservationId, data),
});

ipcRenderer.on('account-found', (event, response) => {
    window.dispatchEvent(new CustomEvent('account-found', { detail: response }));
});

ipcRenderer.on('bike-uploaded', (event, response) => {
    window.dispatchEvent(new CustomEvent('bike-uploaded', { detail: response }));
});

