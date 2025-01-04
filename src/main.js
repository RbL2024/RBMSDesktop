const { app, BrowserWindow, ipcMain } = require('electron');
const axios = require('axios');
const cloudinary = require('cloudinary').v2
const path = require('node:path');
const { datalist } = require('framer-motion/m');
require('dotenv').config();
const localAPI = 'http://localhost:8917';
const cloudAPI = 'https://rbms-backend-g216.onrender.com';
const apiServer = cloudAPI;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1250,
    height: 720,
    title: 'RBMS-Desktop',
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
    },
    autoHideMenuBar: true,
    frame: false,
    resizable: false,
    maximizable: false,
    icon: path.join(__dirname, 'assets', 'RBMSlogo.ico')
  });
  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.shift && input.key.toLowerCase() === 'i') {
      event.preventDefault();
    }
    if (input.key === 'F12') {
      event.preventDefault();
    }
    if (input.ctrlKey && input.shiftKey && input.key === 'R'||input.key === 'r') {
      event.preventDefault();
    }
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('minimize-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    win.minimize();
  }
});
ipcMain.on('close-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    win.close();
  }
})
ipcMain.handle('fetch-data', async (event, url) => {
  try {
    const response = await axios.get(url);
    return response.data; // Send the response data back to the renderer
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Propagate the error back to the renderer
  }
});

ipcMain.handle('load-admin', async (event, myID) => {
  try {
    const loaded = await axios.get(`${apiServer}/loggedInAcc/${myID}`);
    return loaded.data;
  } catch (error) {
    console.error('Error loading admin:', error);
  }
})

ipcMain.handle('update-account', async (event, myID, data) => {
  try {
    const updated = await axios.put(`${apiServer}/updateAccount/${myID}`, data);
    return updated.data;
  } catch (error) {
    console.error('Error updating account:', error);
  }
})
ipcMain.handle('update-pass', async (event, myID, data) => {
  try {
    const updated = await axios.put(`${apiServer}/updatePassword/${myID}`, data);
    return updated.data;
  } catch (error) {
    console.error('Error updating password:', error);
  }
})

ipcMain.handle('find-account', async (event, data) => {
  try {
    // const searchAcc = await axios.post('http://localhost:8917/findAccount', data);
    const searchAcc = await axios.post(`${apiServer}/findAccount`, data);
    if (searchAcc.data.isFound) {
      event.sender.send('account-found', {
        found: true,
        uname: searchAcc.data.uName,
        sAdmin: searchAcc.data.isSAdmin,
        uID: searchAcc.data.userID
      })
      return;
    } else {
      event.sender.send('account-found', {
        found: false
      })
      return;
    }
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
})

ipcMain.handle('upload-bike', async (event, data) => {
  try {
    const result = await cloudinary.uploader.upload(data.i_bike_image, {
      folder: 'bikeImages' 
    });

    if (result) {
      // console.log(result.secure_url);
      const { i_bike_image, ...rest } = data;
      const uploadData = {
        ...rest,
        i_bike_image_url: result.secure_url
      }
      // console.log(uploadData);
      const uploadBike = await axios.post(`${apiServer}/uploadBikeInfo`, uploadData);
      // const uploadBike = await axios.post('${apiServer}/uploadBikeInfo', uploadData);
      if (uploadBike.data.isUploaded) {
        event.sender.send('bike-uploaded', {
          uploaded: true
        })
      } else {
        event.sender.send('bike-uploaded', {
          uploaded: false
        })
      }
    }
  } catch (error) {
    console.error('Error uploading bike:', error);
    throw error;
  }
})

ipcMain.handle('fetch-allbikes', async (event, data) => {
  try {
    const response = await axios.get(`${apiServer}/fetchAllBikes`)
    return response.data
  } catch (error) {
    console.error('Error fetching all bikes:', error);
  }
})

ipcMain.handle('send-otpmail', async (event, data) => {
  try {
    const response = await axios.post(`${apiServer}/sendEmailOTP`, data);
    return response.data
  } catch (error) {
    console.error('Error sending otp mail:', error);
  }
})

ipcMain.handle('check-duplicates', async (event, data) => {
  try {
    // console.log(data)
    const findAcc = await axios.post(`${apiServer}/findDuplication`, data);
    return findAcc.data;

  } catch (error) {
    console.error('Error creating admin account:', error);
  }
})
ipcMain.handle('create-admin', async (event, data) => {
  try {
    const createAdmin = await axios.post(`${apiServer}/createAccount`, data);
    return createAdmin.data;
  } catch (error) {
    console.error('Error creating admin account:', error);
  }
})
ipcMain.handle('sendEmail-Admin', async (event, data) => {
  try {
    const emailSent = await axios.post(`${apiServer}/sendEmailACC`, data);
    // console.log(emailSent)
    return { success: true }
  } catch (error) {
    console.error('Error sending email to admin:', error);
  }
})
ipcMain.handle('get-reservations-and-rented', async (event, data) => {
  try {
    const getResandRent = await axios.get(`${apiServer}/getReservationsAndRentedBikes`);
    return getResandRent.data;
  } catch (error) {
    console.error('Error fetching reservations:', error);
  }
})
ipcMain.handle('get-reservations', async (event, data) => {
  try {
    const getReservations = await axios.get(`${apiServer}/getReservations`);
    return getReservations.data;
  } catch (error) {
    console.error('Error fetching reservations:', error);
  }
})
ipcMain.handle('get-reservations-all', async (event, data) => {
  try {
    const getReservations = await axios.get(`${apiServer}/getReservationsALL`);
    return getReservations.data;
  } catch (error) {
    console.error('Error fetching reservations:', error);
  }
})
ipcMain.handle('get-reservations-five', async (event, data) => {
  try {
    const getReservations = await axios.get(`${apiServer}/getReservationsFIVE`);
    return getReservations.data;
  } catch (error) {
    console.error('Error fetching reservations:', error);
  }
})

ipcMain.handle('status-to-rent', async (event, reservationId, data) => {
  try {
    const response = await axios.put(`${apiServer}/updateBikeStatus/${reservationId}`, data)
    // console.log(response);  
    return response.data;
  } catch (error) {
    console.error('Error updating reservation:', error);
  }
})
ipcMain.handle('status-to-vacant', async (event, reservationId, data) => {
  try {
    const response = await axios.put(`${apiServer}/updateBikeStatusToVacant/${reservationId}`, data)
    // console.log(response);  
    return response.data;
  } catch (error) {
    console.error('Error updating reservation:', error);
  }
})
ipcMain.handle('status-to-vacant-rented', async (event, rentId, data) => {
  try {
    const response = await axios.put(`${apiServer}/updateRentedBikeStatusToVacant/${rentId}`, data)
    // console.log(response);  
    return response.data;
  } catch (error) {
    console.error('Error updating reservation:', error);
  }
})
ipcMain.handle('delete-bike', async (event, bikeId) => {
  try {
    const response = await axios.delete(`${apiServer}/deleteBike/${bikeId}`)
    return response.data;
  } catch (error) {
    console.error('Error deleting bike:', error);
  }
})
ipcMain.handle('get-data-analytics', async (event, data) => {
  try {
    const response = await axios.get(`${apiServer}/getAnalyticsData`);
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics data:', error);
  }
})


ipcMain.handle('create-temp-acc-and-insert-rent', async (event, walkinInfo, walkinRentInfo ) => {
  try {
    // Create temporary account
    const tadRes = await axios.post(`${apiServer}/createTemp`, walkinInfo);
    if (tadRes.data.isCreated) {
      event.sender.send('temp-acc-created', {
        created: true,
        message: tadRes.data.message
      });

      // Insert temporary rent
      if (!walkinRentInfo) {
        throw new Error('Invalid rent input data');
      }
      const trdRes = await axios.post(`${apiServer}/insertRent`, walkinRentInfo);
      return trdRes.data; // Return the rent response data
    } else {
      event.sender.send('temp-acc-created', {
        created: false,
        message: tadRes.data.message
      });
      return;
    }
  } catch (error) {
    console.error('Error in create-temp-acc-and-insert-rent:', error);
    throw error;
  }
});
ipcMain.handle('get-reservation-data', async (event, data) => {
  try {
    const response = await axios.get(`${apiServer}/getReservationData`);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching reservation data:', error);
  }
});
ipcMain.handle('get-rented-data', async (event, data) => {
  try {
    const response = await axios.get(`${apiServer}/getRentData`);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching rent data:', error);
  }
});
ipcMain.handle('get-bike-coords', async (event, data) => {
  try {
    const response = await axios.get(`${apiServer}/bikeCoords`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bike coords:', error);
  }
});