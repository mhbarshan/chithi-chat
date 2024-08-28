/* eslint-disable react/prop-types */
import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

const ProfileView = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          colorScheme="whiteAlpha"
          variant="ghost"
          display={{ base: "flex" }}
          icon={<ViewIcon color="white" fontSize="xl" />}
          onClick={onOpen}
        />
      )}
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          bg="rgba(156, 163, 175, 0.07)"
          borderRadius="lg"
          bgClip="padding-box"
          sx={{
            backdropFilter: "blur(16px)",
          }}
          p={3}
        >
          <ModalHeader
            fontSize="40px"
            fontFamily="mono"
            display="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="160px"
              src={user.picture}
              alt={user.name}
            />
            <Text fontSize={{ base: "24px", md: "28px" }} fontFamily="mono">
              Email: {user.email} <br />
              Gender: {user.gender}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileView;
