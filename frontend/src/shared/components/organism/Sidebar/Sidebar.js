
"use client";

import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import TextsmsIcon from "@mui/icons-material/Textsms";
import Link from "next/link";

import { AccountDetails } from "@/feautures/feed/components/AccountDetails";
import { SearchBar } from "../../atoms/SearchBar";
import { useSidebar } from "@/feautures/feed/hooks/useSidebar";

export function Sidebar() {
  const {
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
  } = useSidebar();

  const sidebar = [
    {
      id: 1,
      text: "İşlerim",
      icon: <HomeRepairServiceIcon />,
      href: "/ana-sayfa",
    },
    {
      id: 2,
      text: "Mesaj Kutusu",
      icon: <TextsmsIcon />,
      href: `/mesaj-kutusu/${storedData?.id}`,
    },
  ];

  return (
    <aside className="flex h-screen w-full flex-col border-r border-gray-200 bg-[#F7F7F9]">

      <div className="border-b border-gray-200 bg-white px-5 py-5">
        <Link
          href="/ana-sayfa"
          className="flex items-center gap-3"
        >
          <img
            src="/sidebarLogo.png"
            alt="Hizmet Kap Logo"
            className="h-11 w-11 rounded-xl border border-gray-200 object-cover"
          />

          <div>
            <h1 className="text-lg  text-[#4E244D]">
              Hizmet Kap
            </h1>

            <p className="text-xs text-gray-400">
              Hizmet yönetim platformu
            </p>
          </div>
        </Link>
      </div>


      <div className="px-5 pt-5">
        <SearchBar
          setOpen={setOpen}
          open={open}
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>


      <div className="flex-1 overflow-y-auto px-5 py-5">


        {open && (
          <div>
            <p className="mb-3 px-2 text-xs  uppercase tracking-wider text-gray-400">
              Popüler Hizmetler
            </p>

            <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
              {filteredCategory.length === 0 ? (
                <p className="px-3 py-2.5 text-sm text-gray-400">
                  "{searchQuery}" için sonuç bulunamadı.
                </p>
              ) : (
                filteredCategory.map((item) => (
                  <button
                    key={item.isim}
                    type="button"
                    onClick={() =>
                      handleCategoryClick(item.isim)
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-[#F1EDF5]"
                  >
                    <img
                      src={item.resim}
                      alt={item.isim}
                      className="h-9 w-9 rounded-lg object-cover"
                    />

                    <span className="text-sm font-medium capitalize text-gray-700">
                      {item.isim}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}


        {!open && (
          <nav>
            <p className="mb-3 px-2 text-xs  uppercase tracking-wider text-gray-400">
              Menü
            </p>

            <ul className="space-y-1.5">
              {sidebar.map((item) => {
                const isActive = active === item.id;

                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={() =>
                        handleClick(item.id)
                      }
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-3 transition-all duration-200 ${
                        isActive
                          ? "bg-[#EDE7F1] text-[#4E244D]"
                          : "text-gray-600 hover:bg-white hover:text-[#4E244D]"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          isActive
                            ? "bg-[#DCD0E3]"
                            : "bg-gray-100"
                        }`}
                      >
                        {item.icon}
                      </span>

                      <span className="text-sm font-medium">
                        {item.text}
                      </span>

                      {isActive && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-[#6B4F6D]" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}


        {!open && category.length > 0 && (
          <div className="mt-8">
            <p className="mb-3 px-2 text-xs  uppercase tracking-wider text-gray-400">
              Hizmetler
            </p>

            <div className="space-y-1">
              {category.slice(0, 5).map((item) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() =>
                    handleCategoryClick(item.isim)
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-white"
                >
                  <span className="h-2 w-2 rounded-full bg-[#B9A6BF]" />

                  <span className="text-sm text-gray-600">
                    {item.isim}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>


      <div className="p-4">
        <AccountDetails />
      </div>
    </aside>
  );
}

