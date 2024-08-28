/* eslint-disable react/prop-types */
import { SmallCloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      bgColor="rgba(156, 163, 175, 0.07)"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      <SmallCloseIcon pl={1} />
    </Box>
  );
};

export default UserBadgeItem;
