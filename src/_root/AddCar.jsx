import {
  Card,
  Input,
  Button,
  Typography,
  Textarea,
} from "@material-tailwind/react";
import { useState } from "react";
import { API_URL } from "../utils/constant";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCar = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    images: [],
  });

  const token = Cookies.get("token");

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: e.target.files });
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title || !formData.description) {
      alert("Please fill in all required fields");
      setLoading(false);
      return;
    }

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("tags", formData.tags);

    for (let i = 0; i < formData.images.length; i++) {
      submitData.append("images", formData.images[i]);
    }

    try {
      const response = await axios.post(`${API_URL}/cars`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Car added successfully!");
      setFormData({
        title: "",
        description: "",
        tags: "",
        images: [],
      });
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Error uploading car");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full min-h-dvh text-white bg-gradient-to-t p-4 to-green-600 from-green-400 grid place-content-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-dvh bg-gradient-to-t p-4 to-green-600 from-green-400 grid place-content-center">
      <Card color="white" shadow={false} className="p-6">
        <Typography variant="h4" color="blue-gray" className="font-primary">
          Add New Car
        </Typography>

        <form
          onSubmit={handleSubmit}
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
        >
          <div className="mb-1 flex flex-col gap-6">
            <Typography
              variant="h6"
              color="blue-gray"
              className="-mb-3 font-primary"
            >
              Title
            </Typography>
            <Input
              size="lg"
              placeholder="Enter car title"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900 font-primary"
              labelProps={{
                className:
                  "before:content-none after:content-none font-primary",
              }}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <Typography
              variant="h6"
              color="blue-gray"
              className="-mb-3 font-primary"
            >
              Description
            </Typography>
            <Textarea
              size="lg"
              placeholder="Enter car description"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900 font-primary min-h-32"
              labelProps={{
                className:
                  "before:content-none after:content-none font-primary",
              }}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <Typography
              variant="h6"
              color="blue-gray"
              className="-mb-3 font-primary"
            >
              Tags
            </Typography>
            <Input
              size="lg"
              placeholder="Enter tags (comma separated)"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900 font-primary"
              labelProps={{
                className:
                  "before:content-none after:content-none font-primary",
              }}
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
            />

            <Typography
              variant="h6"
              color="blue-gray"
              className="-mb-3 font-primary"
            >
              Images
            </Typography>
            <Input
              type="file"
              multiple
              onChange={handleFileChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900 font-primary"
              labelProps={{
                className:
                  "before:content-none after:content-none font-primary",
              }}
            />
          </div>

          <Button
            type="submit"
            className="mt-6 font-primary"
            color="green"
            fullWidth
          >
            Add Car
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddCar;
