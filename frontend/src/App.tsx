

import LoadingSpinner from "./Components/ui/LoadingSpinner";

import { AppRoutes } from "./routes/AppRoutes";

import useAuth from "./hooks/useAuth";


function App() {

  const { loading } = useAuth();


  if (loading) {
    return <LoadingSpinner />;
  }


  return (
    <>
      <AppRoutes />
    </>
  );
}


export default App;