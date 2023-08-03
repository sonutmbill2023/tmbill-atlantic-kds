/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import InitialLoader from './containers/initialLoader/InitialLoader';
import SearchMasterview from './containers/SearchMaster/SearchMasterview';
import Login from './containers/login/login';
import CategorySettings from './components/Settings/Category';
import GeneralSettings from './components/Settings/GeneralSettings';

export default function AllRoutes() {
  useHotkeys(['ctrl+d', 'command+d'], () =>
    window.electron.ipcRenderer.sendMessage(
      'c3f849c465e44b819329ed31cc826988',
      []
    )
  );

  return (
    <App>
      <Router>
        <Routes>
          <Route path={routes.LOADER} element={<InitialLoader />} />
          <Route path={routes.HOME} element={<HomePage />} />
          <Route path={routes.FINDMASTER} element={<SearchMasterview />} />
          <Route
            path={routes.SETTINGS.CATEGOEY}
            element={<CategorySettings />}
          />
          <Route path={routes.SETTINGS.GENERAL} element={<GeneralSettings />} />

          <Route path={routes.LOGIN} element={<Login />} />
        </Routes>
      </Router>
    </App>
  );
}
