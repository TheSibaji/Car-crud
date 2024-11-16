import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { RiSearchLine, RiEditLine, RiDeleteBin6Line } from "react-icons/ri";
import { API_URL, API_URL2 } from "../utils/constant";
import { useNavigate } from "react-router-dom";

const CarListing = ({ cars, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const filteredCars = cars.filter(
    (car) =>
      car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="w-full space-y-6">
      {/* Search Bar */}
      <div className="relative flex w-full max-w-[24rem]">
        <Input
          type="text"
          label="Search cars..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-20"
          containerProps={{
            className: "min-w-0",
          }}
          icon={<RiSearchLine className="h-5 w-5" />}
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <Card
            key={car._id}
            className="mt-6 hover:shadow-lg transition-shadow"
          >
            {/* Card Image */}
            <CardHeader
              color="blue-gray"
              className="relative h-48"
              onClick={() => {
                navigate(`/${car._id}`);
              }}
              role="button"
            >
              <img
                src={`${API_URL2}/${car.images[0]}`}
                alt={car.title}
                className="w-full h-full object-cover"
              />
            </CardHeader>

            {/* Card Content */}
            <CardBody>
              <Typography variant="h5" color="blue-gray" className="mb-2">
                {car.title}
              </Typography>
              <Typography className="text-sm text-gray-600">
                {car.description}
              </Typography>
              <div className="flex flex-wrap gap-2 mt-4">
                {car.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-medium"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </CardBody>

            {/* Card Actions */}
            <CardFooter className="pt-0 flex justify-end gap-2">
              <Button
                size="sm"
                variant="outlined"
                className="flex items-center gap-2"
                onClick={() => onEdit(car)}
              >
                <RiEditLine className="h-4 w-4" /> Edit
              </Button>
              <Button
                size="sm"
                color="red"
                className="flex items-center gap-2"
                onClick={() => onDelete(car._id)}
              >
                <RiDeleteBin6Line className="h-4 w-4" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* No Results Message */}
      {filteredCars.length === 0 && (
        <div className="text-center py-10">
          <Typography color="gray" className="font-normal">
            No cars found matching your search.
          </Typography>
        </div>
      )}
    </div>
  );
};

export default CarListing;
