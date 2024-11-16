import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="font-primary">
      <Outlet />
    </div>
  );
};

export default App;
