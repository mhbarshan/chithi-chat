import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import GenderCheckBox from "./GenderCheckBox";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [gender, setGender] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [picture, setPicture] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const toast = useToast();
  const handClick = () => setShow(!show);
  const handleCheckboxChange = (gender) => {
    setGender(gender);
    // console.log(gender);
  };
  const postDetails = (pic) => {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (
      pic.type === "image/jpeg" ||
      pic.type === "image/jpg" ||
      pic.type === "image/png"
    ) {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chithi");
      data.append("cloud_name", "barshan");
      const uploadPic = axios
        .post(
          "https://cors-anywhere.herokuapp.com/https://api.cloudinary.com/v1_1/barshan/image/upload",
          data
        )
        .then((res) => {
          // console.log(res);
          const picture = res.data.url.toString();
          // console.log("picture", picture);
          setLoading(false);
          setPicture(picture);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
      toast.promise(uploadPic, {
        position: "top",
        success: { title: "Picture Uploaded", description: "Looks great" },
        error: {
          title: "Couldn't Upload",
          description: "Something wrong. Try again!",
        },
        loading: { title: "Uploading...", description: "Please wait" },
      });
    } else {
      toast({
        title: "Please select an image in jpg/png format",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !email || !password || !confirmPassword || !gender) {
      toast({
        title: "Please Fill all the fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Password don't match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user/", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          gender,
          password,
          confirmPassword,
          picture,
        }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // console.log(data);
      toast({
        title: "Successfully registered",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="name"
          //   borderRadius="25px"
          border=".5px solid gray"
          placeholder="Enter your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          //   borderRadius="25px"
          border=".5px solid gray"
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            // borderRadius="25px"
            border=".5px solid gray"
            placeholder="Enter your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={handClick}
              variant="unstyled"
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirmPassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            // borderRadius="25px"
            border=".5px solid gray"
            placeholder="Enter your Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={handClick}
              variant="unstyled"
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="gender" isRequired>
        <FormLabel>Gender</FormLabel>
        <GenderCheckBox
          onCheckBoxChange={handleCheckboxChange}
          selectedGender={gender}
        />
      </FormControl>
      <FormControl id="pic" isRequired>
        <FormLabel>Pic</FormLabel>
        <Input
          //   className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          border=".5px solid gray"
          type="file"
          accept="image/"
          onChange={(e) => postDetails(e.target.files[0])}
          p={1.5}
        />
      </FormControl>
      <Button
        colorScheme="teal"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
