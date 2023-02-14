// i18n
import './locales/i18n';

// highlight
import './utils/highlight';

// scroll bar
import 'simplebar/src/simplebar.css';

// lightbox
import 'react-image-lightbox/style.css';

// map
import 'mapbox-gl/dist/mapbox-gl.css';

// editor
import 'react-quill/dist/quill.snow.css';

// slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
// web3
import Web3 from 'web3';
import { Web3ReactProvider } from '@web3-react/core';
// @mui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
// redux
import { store, persistor } from './redux/store';
// contexts
import { SettingsProvider } from './contexts/SettingsContext';
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext';

// Check our docs
// https://docs-minimals.vercel.app/authentication/ts-version

import { AuthProvider } from './contexts/JWTContext';
import { WalletContextProvider } from './contexts/WalletContext';
import { NotificationContextProvider } from './contexts/NotificationContext';
// import { AuthProvider } from './contexts/Auth0Context';
// import { AuthProvider } from './contexts/FirebaseContext';
// import { AuthProvider } from './contexts/AwsCognitoContext';

//
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

// ----------------------------------------------------------------------

function getLibrary(provider) {
  const library = new Web3(provider);
  library.pollingInterval = 12000;
  return library;
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <AuthProvider>
      <HelmetProvider>
        <ReduxProvider store={store}>
          <WalletContextProvider>
            <NotificationContextProvider>
              <PersistGate loading={null} persistor={persistor}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <SettingsProvider>
                    <CollapseDrawerProvider>
                      <BrowserRouter>
                        <App />
                      </BrowserRouter>
                    </CollapseDrawerProvider>
                  </SettingsProvider>
                </LocalizationProvider>
              </PersistGate>
            </NotificationContextProvider>
          </WalletContextProvider>
        </ReduxProvider>
      </HelmetProvider>
    </AuthProvider>
  </Web3ReactProvider>,
  document.getElementById('root')
);
