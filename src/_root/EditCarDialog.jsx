import { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Textarea,
} from "@material-tailwind/react";
import axios from "axios";
import { API_URL } from "../utils/constant";
import Cookies from "js-cookie";
const EditCarDialog = ({ isOpen, onClose, carId, onCarUpdated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    images: [],
  });
  const [existingImages, setExistingImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const token = Cookies.get("token");
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/cars/${carId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const car = response.data;
        setFormData({
          title: car.title,
          description: car.description,
          tags: car.tags.join(", "),
        });
        setExistingImages(car.images || []);
      } catch (error) {
        console.error("Error fetching car details:", error);
      }
    };

    if (carId) fetchCarDetails();
  }, [carId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleUpdate = async () => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("tags", formData.tags);

    selectedFiles.forEach((file) => data.append("images", file));

    try {
      const response = await axios.put(`${API_URL}/cars/${carId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      onCarUpdated(response.data.car);
      onClose();
    } catch (error) {
      console.error("Error updating car:", error);
    }
  };

  return (
    <Dialog open={isOpen} handler={onClose} size="lg">
      <DialogHeader>Edit Car</DialogHeader>
      <DialogBody divider>
        <div className="flex flex-col gap-4">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <Input
            label="Tags (comma-separated)"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
          />

          <div>
            <label className="block mb-2 font-medium">Existing Images:</label>
            <div className="flex flex-wrap gap-2">
              {existingImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt="Car"
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>

          <Input
            type="file"
            multiple
            onChange={handleFileChange}
            label="Upload New Images"
            accept="image/*"
          />
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={onClose} className="mr-2">
          Cancel
        </Button>
        <Button variant="gradient" color="green" onClick={handleUpdate}>
          Save Changes
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default EditCarDialog;
