import { BrowserRouter } from "react-router-dom";
import ThemeProvider from "./providers/ThemeProvider";
import { RoutesComponent } from "./routes/routes";
import { ToastProvider } from "./contexts/ToastContext";
import { ApiProvider } from "./services/api";
import { Provider } from "react-redux";
import store from "./stores/store";

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <ApiProvider>
          <ThemeProvider>
            <BrowserRouter>
              <RoutesComponent />
            </BrowserRouter>
          </ThemeProvider>
        </ApiProvider>
      </ToastProvider>
    </Provider>
  );
}

export default App;
