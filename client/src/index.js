import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"

import App from "./App";
import ChatProvider from "./context/ChatProvider";

import { ChakraProvider } from "@chakra-ui/react"
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChatProvider>
    <BrowserRouter>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </ChatProvider>
);
