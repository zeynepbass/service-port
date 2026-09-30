
"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateStatus } from "../api/post.api";

export function useTadilat  (initialItems = []){
  const [itemsAktif, setItemsAktif] = useState(initialItems);
  const [showText, setShowText] = useState({});

  useEffect(() => {
    const initialState = {};

    itemsAktif.forEach((item) => {
      initialState[item._id] = item.durum === "aktif";
    });

    setShowText(initialState);
  }, [itemsAktif]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, show }) =>
      updateStatus(id, show, false),

    onSuccess: (result, variables) => {
      const { id } = variables;

      setShowText((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));

      setItemsAktif((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                durum: result.newDurum,
              }
            : item
        )
      );
    },
  });

  const handleSubmit = (e, id) => {
    e.preventDefault();

    updateStatusMutation.mutate({
      id,
      show: showText[id],
    });
  };

  return {
    itemsAktif,
    showText,
    handleSubmit,
    isUpdating: updateStatusMutation.isPending,
  };
};

