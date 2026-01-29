'use client'

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import { SnackbarProvider } from "notistack";


export default function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SnackbarProvider anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        {children}
        </SnackbarProvider>
      </PersistGate>
    </Provider>
  );
}
