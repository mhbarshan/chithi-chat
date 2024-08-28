/* eslint-disable react/prop-types */
import { Avatar, Box, Text } from "@chakra-ui/react";
// import { ChatState } from "../../../context/ChatProvider";

const UserListItem = ({ handleFunction, user }) => {
  //   const { user } = ChatState();
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      w="100%"
      display="flex"
      alignItems="center"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
      _hover={{
        backgroundColor: "rgba(156, 163, 175, 0.3)",
        borderRadius: "lg",
        bgClip: "padding-box",
      }}
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.picture}
      />

      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">{user.email}</Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
