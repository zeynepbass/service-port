
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getCategories } from "../api/post.api";
import { toSlug } from "@/shared/helpers/toSlug";

export function useSidebar ()  {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [storedData, setStoredData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: category = [],
    isLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Kategori araması için ayrı bir API endpointi yok (getCategories
  // tüm listeyi döner), bu yüzden filtreleme istemci tarafında
  // useMemo ile yapılıyor.
  const filteredCategory = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("tr-TR");

    if (!query) {
      return category;
    }

    return category.filter((item) =>
      item.isim?.toLocaleLowerCase("tr-TR").includes(query)
    );
  }, [category, searchQuery]);

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearchQuery(value);
    setOpen(true);
  };

  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem("kullanici") || "null"
    );

    setStoredData(data);
  }, []);

  const handleClick = (id) => {
    setActive(id);
  };

  const handleCategoryClick = (name) => {
    router.push(`/${toSlug(name)}`);
  };

  return {
    open,
    setOpen,
    active,
    storedData,
    category,
    filteredCategory,
    searchQuery,
    handleSearchChange,
    handleClick,
    handleCategoryClick,
    isLoading,
  };
};

