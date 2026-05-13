import AppRouter from "./routes/AppRouter";
import { Toaster } from "sonner";
import "sonner/dist/styles.css";

function App() {
  return (
    <>
      <AppRouter />

      <Toaster
        richColors
        closeButton
        position="bottom-right"
        duration={3500}
      />
    </>
  );
}

export default App;