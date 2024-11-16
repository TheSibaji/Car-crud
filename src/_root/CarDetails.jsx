import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  Card,
  CardBody,
  Typography,
  Chip,
  IconButton,
  Button,
  Breadcrumbs,
} from "@material-tailwind/react";
import {
  RiArrowLeftLine,
  RiEditLine,
  RiDeleteBin6Line,
  RiShareForwardLine,
} from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL, API_URL2 } from "../utils/constant";

const CarDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [car, setCar] = useState({
    title: "",
    description: "",
    tags: [],
    images: [],
    ownerId: "",
    _id: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          navigate("/sign-in");
          return;
        }

        const res = await axios.get(`${API_URL}/cars/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data) {
          setCar(res.data.car);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching car details:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchCarDetails();
    }
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      const token = Cookies.get("token");
      await axios.delete(`${API_URL}/cars/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/");
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Failed to delete car");
    }
  };

  if (loading) {
    return (
      <div className="font-primay flex justify-center items-center min-h-screen">
        <Typography>Loading...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-primay flex justify-center items-center min-h-screen">
        <Typography color="red">Error: {error}</Typography>
      </div>
    );
  }

  return (
    <div className="font-primay container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <div className="font-primay mb-6">
        <Breadcrumbs>
          <a href="/" className="font-primay opacity-60">
            Home
          </a>
          <a href="/" className="font-primay opacity-60">
            Cars
          </a>
          <a>{car.title}</a>
        </Breadcrumbs>
      </div>

      <div className="font-primay grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image Carousel */}
        <div className="font-primay w-full">
          <Card className="font-primay w-full overflow-hidden">
            {car.images && car.images.length > 0 ? (
              <Carousel
                showArrows={true}
                showStatus={false}
                showThumbs={false}
                infiniteLoop={false}
                className="font-primay custom-carousel"
              >
                {car.images.map((image, index) => (
                  <div
                    key={index}
                    className="font-primay aspect-w-16 aspect-h-9"
                  >
                    <img
                      src={`${API_URL2}/${image}`}
                      alt={`${car.title} - Image ${index + 1}`}
                      className="font-primay object-cover h-[400px] w-full"
                    />
                  </div>
                ))}
              </Carousel>
            ) : (
              <div className="font-primay h-[400px] flex items-center justify-center bg-gray-100">
                <Typography color="gray">No images available</Typography>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Car Details */}
        <div className="font-primay space-y-6">
          <div className="font-primay flex justify-between items-start">
            <div>
              <Typography
                variant="h2"
                color="blue-gray"
                className="font-primay mb-2"
              >
                {car.title}
              </Typography>
              <div className="font-primay flex flex-wrap gap-2 mb-4">
                {car.tags &&
                  car.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      value={tag.trim()}
                      color="blue"
                      variant="ghost"
                      size="sm"
                    />
                  ))}
              </div>
            </div>
            <div className="font-primay flex gap-2">
              <IconButton variant="outlined" color="blue-gray" size="sm">
                <RiShareForwardLine className="font-primay h-4 w-4" />
              </IconButton>
              <IconButton
                variant="outlined"
                color="blue"
                size="sm"
                onClick={() => navigate(`/edit-car/${car._id}`)}
              >
                <RiEditLine className="font-primay h-4 w-4" />
              </IconButton>
              <IconButton
                variant="outlined"
                color="red"
                size="sm"
                onClick={handleDelete}
              >
                <RiDeleteBin6Line className="font-primay h-4 w-4" />
              </IconButton>
            </div>
          </div>

          <Card>
            <CardBody>
              <Typography
                variant="h6"
                color="blue-gray"
                className="font-primay mb-2"
              >
                Description
              </Typography>
              <Typography className="font-primay text-gray-700 whitespace-pre-line">
                {car.description || "No description available"}
              </Typography>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Typography
                variant="h6"
                color="blue-gray"
                className="font-primay mb-4"
              >
                Additional Information
              </Typography>
              <div className="font-primay grid grid-cols-2 gap-4">
                <div>
                  <Typography className="font-primay font-medium text-blue-gray-600">
                    ID
                  </Typography>
                  <Typography className="font-primay text-sm">
                    {car._id}
                  </Typography>
                </div>
                <div>
                  <Typography className="font-primay font-medium text-blue-gray-600">
                    Owner ID
                  </Typography>
                  <Typography className="font-primay text-sm">
                    {car.ownerId}
                  </Typography>
                </div>
                {car.createdAt && (
                  <div>
                    <Typography className="font-primay font-medium text-blue-gray-600">
                      Created At
                    </Typography>
                    <Typography className="font-primay text-sm">
                      {new Date(car.createdAt).toLocaleDateString()}
                    </Typography>
                  </div>
                )}
                {car.updatedAt && (
                  <div>
                    <Typography className="font-primay font-medium text-blue-gray-600">
                      Last Updated
                    </Typography>
                    <Typography className="font-primay text-sm">
                      {new Date(car.updatedAt).toLocaleDateString()}
                    </Typography>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          <div className="font-primay flex gap-4">
            <Button
              size="lg"
              className="font-primay flex items-center gap-2"
              onClick={() => navigate(-1)}
            >
              <RiArrowLeftLine className="font-primay h-4 w-4" />
              Back to List
            </Button>
            <Button
              size="lg"
              variant="outlined"
              onClick={() => {
                // Add contact handler
              }}
            >
              Contact Owner
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
