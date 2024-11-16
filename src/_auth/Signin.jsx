import { Card, Input, Button, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../utils/constant";
import Cookies from "js-cookie";
const Signin = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);
    setLoading(true);
    if (data.email === "" || data.password === "") {
      alert("Please fill all fields");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/users/signin`, {
        email: data.email,
        password: data.password,
      });
      console.log(res.data);
      alert(res.data.message);
      Cookies.set("token", res.data.token, { expires: 7 });
      navigate("/");
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
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
          Sign In
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
              Your Email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900 font-primary"
              labelProps={{
                className:
                  "before:content-none after:content-none font-primary",
              }}
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
            <Typography
              variant="h6"
              color="blue-gray"
              className="-mb-3 font-primary"
            >
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900 font-primary"
              labelProps={{
                className:
                  "before:content-none after:content-none font-primary",
              }}
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </div>
          <Button
            type="submit"
            className="mt-6 font-primary"
            color="green"
            fullWidth
          >
            sign in
          </Button>
          <Typography
            color="gray"
            className="mt-4 text-center font-normal font-primary"
          >
            dosn't have an account?{" "}
            <Link
              to="/sign-up"
              className="font-medium text-gray-900 font-primary"
            >
              Sign Up
            </Link>
          </Typography>
        </form>
      </Card>
    </div>
  );
};

export default Signin;
