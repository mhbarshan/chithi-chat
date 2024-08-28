import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Portal,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import "./notification.css";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import ProfileView from "./ProfileView";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatSkeleton from "./ChatSkeleton";
import UserListItem from "../../components/Auth/User/UserListItem";
import { getSender } from "../../Config/ChatConfig";
import io from "socket.io-client";

const ENDPOINT = "https://chithi-chat.onrender.com";
var socket;

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState("");

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();
  const navigate = useNavigate();
  const toast = useToast();

  const logoutHandler = () => {
    socket = io(ENDPOINT);
    socket.close();
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something to search",
        status: "warning",
        duration: 1000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      //   console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Not found!",
        description: error.data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);
      //   console.log(data);

      if (!chats.find((c) => c._id == data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoading(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error Fetching The conversation",
        description: error.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        p="5px 10px 5px 10px"
        className=" flex rounded-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0"
      >
        <Tooltip label="Search user to chat" hasArrow placement="bottom-end">
          <Button
            variant="ghost"
            colorScheme="whiteAlpha"
            onClick={onOpen}
            ref={btnRef}
          >
            <i className="fas fa-search text-teal-600"></i>
            <Text display={{ base: "none", md: "flex" }} px="4px">
              <span className="text-teal-600 font-mono ">Search User</span>
            </Text>
          </Button>
        </Tooltip>
        <Text
          fontSize={{ base: "1.5xl", md: "2xl" }}
          fontFamily="mono"
          className="text-emerald-50"
        >
          <span className="text-teal-600 font-mono font-bold"> Cithi</span>
          -ChatApp
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              {notifications.length > 0 && (
                <div className="notification-badge">
                  <BellIcon fontSize="2xl" m={1} />
                  <span className="badge">{notifications.length}</span>
                </div>
              )}
              {!notifications.length && <BellIcon fontSize="2xl" m={1} />}
            </MenuButton>
            <Portal>
              <MenuList
                bg="rgba(156, 163, 175, 0.25)"
                borderRadius="lg"
                bgClip="padding-box"
                sx={{
                  backdropFilter: "blur(16px)",
                }}
                border="none"
                p={3}
              >
                {notifications.length === 0 && "No new messages"}
                {notifications.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    bg="inherit)"
                    bgClip="padding-box"
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotifications(
                        notifications.filter((n) => n !== notif)
                      );
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>
                ))}
              </MenuList>
            </Portal>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              colorScheme="whiteAlpha"
              variant="ghost"
              rightIcon={<ChevronDownIcon textColor="white" />}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.picture}
              />
            </MenuButton>
            <Portal>
              <MenuList
                bg="rgba(156, 163, 175, 0.25)"
                borderRadius="lg"
                bgClip="padding-box"
                sx={{
                  backdropFilter: "blur(16px)",
                }}
                border="none"
                p={3}
              >
                <ProfileView user={user}>
                  <MenuItem bg="rgba(156, 163, 175, 0.25)" bgClip="padding-box">
                    Profile
                  </MenuItem>
                </ProfileView>
                <MenuDivider />
                <MenuItem
                  bg="rgba(156, 163, 175, 0.25)"
                  bgClip="padding-box"
                  onClick={logoutHandler}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        </div>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent
          bg="rgba(156, 163, 175, 0.07)"
          borderRadius="lg"
          bgClip="padding-box"
          sx={{
            backdropFilter: "blur(16px)",
          }}
        >
          <DrawerCloseButton />
          <DrawerHeader>Search User</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Enter name"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch} colorScheme="teal">
                <i className="fas fa-search text-white-600"></i>
              </Button>
            </Box>
            {loading ? (
              <ChatSkeleton />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>

          <DrawerFooter>
            <Button colorScheme="teal">Close</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
