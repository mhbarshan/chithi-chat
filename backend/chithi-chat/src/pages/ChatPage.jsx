// import axios from "axios";
// import { useEffect, useState } from "react";

import { Box } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import SideDrawer from "./utils/SideDrawer";
import MyChat from "./utils/MyChat";
import ChatBox from "./utils/ChatBox";
import { useState } from "react";

const ChatPage = () => {
  const { user } = ChatState();

  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        d="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
        className="flex"
      >
        {user && <MyChat fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
