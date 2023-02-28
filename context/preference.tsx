import React from 'react';

export const PreferencesContext = React.createContext({
  toggleTheme: () => {},
  isThemeDark: false,
  toggleThemeStyle: () => {},
  isMD2Theme: false,
});
