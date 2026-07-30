import AppRouter from "./routes/AppRouter";
import { Toaster } from "sonner";
import "sonner/dist/styles.css";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/useTheme";

function App() {
  const { isAuthenticated } = useAuth();
  const { resolvedTheme } = useTheme();

  return (
    <>
      <AppRouter />

      <Toaster
        richColors
        closeButton
        position="bottom-right"
        duration={3500}
        theme={isAuthenticated ? resolvedTheme : "light"}
        toastOptions={{
          classNames: {
            toast: "border-border bg-popover text-popover-foreground shadow-xl",
            description: "text-muted-foreground",
            closeButton:
              "border-border bg-background text-foreground hover:bg-accent",
          },
        }}
      />
    </>
  );
}

export default App;