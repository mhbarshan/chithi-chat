/* eslint-disable react/prop-types */
import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import { useEffect, useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import ChatSkeleton from "./ChatSkeleton";
import {
  getSender,
  getSenderId,
  getSenderImage,
} from "../../Config/ChatConfig";
import GroupChatModal from "../utils/GroupChatModal";
import io from "socket.io-client";
import "./active.css";

const MyChat = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const toast = useToast();
  const ENDPOINT = "http://localhost:5000";
  var socket;
  const fetchChat = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);

      setChats(data);
    } catch (error) {
      toast({
        title: "Error Fetching The conversation",
        description: error.response.data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };
  useEffect(() => {
    (socket = io(ENDPOINT)), socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
      // console.log("Connected");
    });
    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChat();
  }, [fetchAgain]);
  // const isOnline = onlineUsers.includes(chats._id);
  // // chats.map((chat) => onlineUsers.includes(chat._id));
  // console.log(isOnline);
  console.log(onlineUsers);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      w={{ base: "100%", md: "30%" }}
      p={3}
      bg="rgba(156, 163, 175, 0.07)"
      borderRadius="lg"
      bgClip="padding-box"
      sx={{
        backdropFilter: "blur(16px)",
      }}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <span className="font-mono"> My Chats</span>
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "14px", md: "17px" }}
            rightIcon={<AddIcon />}
            colorScheme="teal"
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        w="100%"
        h="100%"
        overflow="hidden"
        borderRadius="lg"
      >
        {chats ? (
          <Stack overflowY="auto" p={3}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat == chat ? "teal" : "rgba(156, 163, 175, 0.07)"}
                bgClip="padding-box"
                px={3}
                py={3}
                w="100%"
                display="flex"
                alignItems="center"
                borderRadius="lg"
                gap={2}
                key={chat._id}
                _hover={{
                  backgroundColor: "rgba(156, 163, 175, 0.3)",
                  borderRadius: "lg",
                  bgClip: "padding-box",
                }}
              >
                {onlineUsers.includes(
                  !chat.isGroupChat && getSenderId(loggedUser, chat.users)
                ) && (
                  <div className="active-badge">
                    <Avatar
                      mr={2}
                      size="sm"
                      cursor="pointer"
                      name={
                        !chat.isGroupChat
                          ? getSender(loggedUser, chat.users)
                          : chat.chatName
                      }
                      src={
                        !chat.isGroupChat
                          ? getSenderImage(loggedUser, chat.users)
                          : "https://i.ibb.co/tK3T0sr/group-chat.png"
                      }
                    />
                    <span className="badge-green"></span>
                  </div>
                )}
                {!onlineUsers.includes(
                  !chat.isGroupChat && getSenderId(loggedUser, chat.users)
                ) && (
                  <Avatar
                    mr={2}
                    size="sm"
                    cursor="pointer"
                    name={
                      !chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName
                    }
                    src={
                      !chat.isGroupChat
                        ? getSenderImage(loggedUser, chat.users)
                        : "https://i.ibb.co/tK3T0sr/group-chat.png"
                    }
                  />
                )}
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatSkeleton />
        )}
      </Box>
    </Box>
  );
};

export default MyChat;
