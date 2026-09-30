
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import io from "socket.io-client";

import {
  getConversations,
  getMessages,
  sendMessage,
} from "../api/post.api";
import {  getUsers} from "@/feautures/user/api/user.api"
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const socket = io(baseUrl);

export function useChatroom (id)  {
  const queryClient = useQueryClient();

  const aliciIdStored = `${id}`;

  const [storedData, setStoredData] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [open, setOpen] = useState(false);

  const gonderenId = storedData?.id;


  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("kullanici") || "null"
    );

    setStoredData(stored);
  }, []);


  const {
    data: userList = [],
    isLoading: isUsersLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });


  const {
    data = [],
    isLoading: isConversationsLoading,
  } = useQuery({
    queryKey: ["conversations", aliciIdStored],
    queryFn: () => getConversations(aliciIdStored),
    enabled: !!aliciIdStored,
  });


  const {
    data: messages = [],
    isLoading: isMessagesLoading,
  } = useQuery({
    queryKey: ["messages", gonderenId, selectedUser],
    queryFn: () => getMessages(gonderenId, selectedUser),
    enabled: !!gonderenId && !!selectedUser,
  });


  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      if (
        selectedUser &&
        (
          (
            msg.gonderenId === gonderenId &&
            msg.aliciId === selectedUser
          ) ||
          (
            msg.gonderenId === selectedUser &&
            msg.aliciId === gonderenId
          )
        )
      ) {
        queryClient.setQueryData(
          ["messages", gonderenId, selectedUser],
          (oldMessages = []) => [
            ...oldMessages,
            msg,
          ]
        );
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [
    selectedUser,
    gonderenId,
    queryClient,
  ]);


  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,

    onSuccess: (savedMsg) => {
      socket.emit("sendMessage", savedMsg);

      setNewMessage("");
    },

    onError: (error) => {
      console.error(
        "Mesaj gönderme hatası:",
        error
      );
    },
  });


  const handleSelectUser = (userId) => {
    setSelectedUser(userId);
  };


  const handleSend = (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedUser) {
      return;
    }

    const msgData = {
      gonderenId,
      aliciId: selectedUser,
      text: newMessage,
      time: new Date(),
    };

    sendMessageMutation.mutate(msgData);
  };


  const filteredData = useMemo(() => {
    return userList.filter((user) => {
      if (!user) return false;

      const isAlıcı =
        user._id === aliciIdStored;

      const hasConversation = data.some(
        (kon) =>
          (
            kon.gonderenId === user._id &&
            kon.aliciId === gonderenId
          ) ||
          (
            kon.aliciId === user._id &&
            kon.gonderenId === gonderenId
          )
      );

      return (
        user._id !== gonderenId &&
        (hasConversation || isAlıcı)
      );
    });
  }, [
    userList,
    data,
    gonderenId,
    aliciIdStored,
  ]);

  return {
    userList,
    filteredData,
    messages,

    selectedUser,
    newMessage,
    open,

    setNewMessage,
    setOpen,

    handleSelectUser,
    handleSend,

    isLoading:
      isUsersLoading ||
      isConversationsLoading ||
      isMessagesLoading,

    isSending:
      sendMessageMutation.isPending,
  };
};

