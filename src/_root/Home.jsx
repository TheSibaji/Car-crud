import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { API_URL } from "../utils/constant";
import { Button, IconButton } from "@material-tailwind/react";
import { RiAddCircleLine, RiLogoutCircleRLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import CarListing from "./CarListing";
import EditCarDialog from "./EditCarDialog";

const Home = () => {
  const token = Cookies.get("token");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);

  const handleCarUpdated = (updatedCar) => {
    console.log("Car updated:", updatedCar);
    // Refresh or update UI
    fetchCars();
  };

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/get-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      setUserData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCars = async () => {
    try {
      const res = await axios.get(`${API_URL}/cars`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      setCars(res.data.cars);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserData();
      fetchCars();
    }
  }, [token]);

  const handleDelete = async (carId) => {
    try {
      await axios.delete(`${API_URL}/cars/${carId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCars(); // Refresh the list
      alert("Car deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to delete car");
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    alert("Logged out successfully");
    navigate("/sign-in");
  };

  const handleEdit = async (id) => {
    setEditDialogOpen(true);
    console.log("cdd", id);

    setSelectedCarId(id._id);
  };

  return (
    <div className="p-6">
      <div className="flex border-b border-black/15 pb-6 flex-row items-center justify-between gap-4">
        <h3 className="text-2xl font-primary font-bold">CAR CRUD</h3>
        <div className="flex flex-row items-center gap-2 text-right">
          {userData ? (
            <div>
              <h4>Welcome, {userData.name}</h4>
              <p>{userData.email}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
          <Button
            className="flex flex-row items-center gap-2 ml-2"
            onClick={() => {
              navigate("/add-car");
            }}
          >
            <RiAddCircleLine />
            <span>Add Car</span>
          </Button>
          <IconButton onClick={handleLogout}>
            <RiLogoutCircleRLine />
          </IconButton>
        </div>
      </div>
      <div className="mt-6">
        <CarListing cars={cars} onDelete={handleDelete} onEdit={handleEdit} />
      </div>
      <EditCarDialog
        isOpen={isEditDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        carId={selectedCarId}
        onCarUpdated={handleCarUpdated}
      />
    </div>
  );
};

export default Home;
