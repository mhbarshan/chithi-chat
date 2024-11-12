/* eslint-disable react/prop-types */
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import Lottie from "react-lottie";
import { ChatState } from "../../context/ChatProvider";
import { SlEnvolopeLetter } from "react-icons/sl";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderProfile } from "../../Config/ChatConfig";
import ProfileView from "../../pages/utils/ProfileView";
import UpdateGroupChatModal from "../../pages/utils/UpdateGroupChatModal";
import { useEffect, useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import axios from "axios";
import animationData from "../../animations/typing.json";
import "./styles.css";
import ScrollableChat from "../../pages/utils/ScrollableChat";
import io from "socket.io-client";

const ENDPOINT = "https://chithi-chat.onrender.com";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessages, setNewMessages] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
  } = ChatState();
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessage = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,

        config
      );

      setMessages(data);
      // console.log(messages);
      setLoading(false);

      socket.emit("joinChat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Something Went wrong",
        description: error.response.data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT, {
      query: {
        userId: user._id,
      },
    });
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
      // console.log("Connected");
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stopTyping", () => setIsTyping(false));
  }, []);
  useEffect(() => {
    fetchMessage();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // console.log(notifications, "-------");
  useEffect(() => {
    socket.on("messageReceived", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notifications.includes(newMessageReceived)) {
          setNotifications([newMessageReceived, ...notifications]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const sendMessage = async () => {
    if (newMessages) {
      socket.emit("stopTyping", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessages("");

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessages,
            chatId: selectedChat._id,
          },
          config
        );
        // console.log(data);
        socket.emit("newMessage", data);
        setMessages([...messages, data]);
        setLoading(false);
      } catch (error) {
        toast({
          title: "Something Went wrong",
          description: error.response.data.message,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setLoading(false);
      }
      setNewMessages("");
    }
  };

  const typingHandler = (e) => {
    setNewMessages(e.target.value);

    if (!socketConnected) {
      return;
    }
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    // console.log(lastTypingTime);
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      // console.log(timeNow);
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength) {
        socket.emit("stopTyping", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="mono"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon color="white" fontSize="xl" />}
              onClick={() => setSelectedChat("")}
              colorScheme="whiteAlpha"
              variant="ghost"
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileView
                  user={getSenderProfile(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {" "}
                {selectedChat.chatName}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessage={fetchMessage}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="rgba(156, 163, 175, 0.07)"
            w="100%"
            h="100%"
            overflowY="hidden"
            bgClip="padding-box"
            borderRadius="lg"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="message">
                <ScrollableChat messages={messages} />
              </div>
            )}
            {isTyping ? (
              <div>
                <Lottie
                  width={70}
                  options={defaultOptions}
                  style={{ marginBottom: 15, marginLeft: 0, color: "white" }}
                />
              </div>
            ) : (
              <> </>
            )}
            <FormControl
              display="flex "
              // onKeyDown={sendMessage}
              isRequired
              mt={3}
              w="100%"
              gap={2}
            >
              <Input
                w={{ base: "90%" }}
                variant="filled"
                placeholder="Enter message..."
                bg="rgba(156, 163, 175, 0.15)"
                onChange={typingHandler}
                value={newMessages}
              />
              <IconButton
                w={{ base: "10%" }}
                display={{ base: "flex" }}
                icon={
                  <BsFillSendFill className="text-white text-center text-lg" />
                }
                onClick={sendMessage}
                colorScheme="whiteAlpha"
                bg="rgba(156, 163, 175, 0.15)"
                variant="solid"
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={3}
            fontSize="3xl"
            flexDirection="column"
          >
            <>
              <p>
                Welcome👋
                <span className="text-teal-600 font-mono text-4xl">
                  {user.name}🎉
                </span>{" "}
              </p>
              <p>Select a conversation to send</p>
              <span className="text-teal-600 font-mono text-4xl">Chithi</span>
              <SlEnvolopeLetter className="text-3xl md:text-5xl text-center text-yellow-100" />
            </>
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
