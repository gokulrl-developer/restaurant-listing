import { Toaster } from "sonner"
import MainRoutes from "./MainRoutes"

function App() {

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <MainRoutes />
    </>
  )
}

export default App
