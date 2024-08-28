import {
  Box,
  Button,
  FormControl,
  Input,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "../../components/Auth/User/UserListItem";
import UserBadgeItem from "../../components/Auth/User/UserBadgeItem";
// eslint-disable-next-line react/prop-types
const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      toast({
        title: "Please enter something to search",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setSearchResult([]);
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
        description: error.response.data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      onClose();
      toast({
        title: "Group Chat Created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Something went wrong! Try again.",
        description: error.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User Already added",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          bg="rgba(156, 163, 175, 0.07)"
          borderRadius="lg"
          bgClip="padding-box"
          sx={{
            backdropFilter: "blur(16px)",
          }}
        >
          <ModalHeader
            fontSize="35px"
            fontFamily="mono"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add participants eg: Barshan"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box display="flex" w="100%" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={user._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <span>
                <Spinner size="lg" textColor="white" />
              </span>
            ) : (
              searchResult
                ?.slice(0, 5)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
