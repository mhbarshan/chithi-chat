import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      navigate("/chats");
    }
  }, [navigate]);
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        // borderWidth="1px"
        p={3}
        className="text-center rounded-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0"
      >
        <Text fontSize="3xl" fontFamily="mono" className="text-emerald-50">
          <span className="text-teal-600 font-mono font-bold"> Cithi</span> -
          ChatApp
        </Text>
      </Box>
      <Box
        className=" text-white rounded-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0"
        w="100%"
        p={4}
        borderRadius="lg"
        color="white"
      >
        <Tabs variant="soft-rounded" colorScheme="">
          <TabList mb="1em">
            <Tab w="50%">
              <span className="text-white">Login</span>
            </Tab>
            <Tab w="50%">
              <span className="text-white">Sign Up</span>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
