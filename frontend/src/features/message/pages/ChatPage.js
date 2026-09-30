
"use client";

import { Button } from "@/shared/components/atoms";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import {Loading} from "@/shared/components/molecules"
import { ChatScore } from "../components/ChatScore";
import { useChatroom } from "../hooks/useChatRoom";

export default function Chatroom({ id }) {
  const {
    filteredData,
    messages,
    selectedUser,
    newMessage,
    open,

    setNewMessage,
    setOpen,

    handleSelectUser,
    handleSend,

    isLoading,
    isSending,
  } = useChatroom(id);

  if (isLoading) {
    return <Loading/>
  }

  return (
    <div className="flex h-[90vh] overflow-hidden bg-[#F7F7F9]">


      <aside className="w-[280px] shrink-0 border-r border-gray-200 bg-white">

        <div className="border-b border-gray-100 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDE7F1]">
              <ChatBubbleOutlineIcon
                sx={{
                  fontSize: 21,
                  color: "#6B4F6D",
                }}
              />
            </div>

            <div>
              <h2 className="text-sm  text-[#222C31]">
                Mesajlar
              </h2>

              <p className="text-xs text-gray-400">
                {filteredData.length} kullanıcı
              </p>
            </div>
          </div>
        </div>

        <div className="h-[calc(90vh-81px)] overflow-y-auto p-3">
          {filteredData.length > 0 ? (
            filteredData.map((item) => {
              const isSelected = selectedUser === item._id;

              return (
                <div
                  key={item._id}
                  onClick={() => handleSelectUser(item._id)}
                  className={`group mb-1 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
                    isSelected
                      ? "bg-[#EDE7F1] text-[#4E244D]"
                      : "text-[#222C31] hover:bg-[#F7F7F9]"
                  }`}
                >
   
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm  ${
                      isSelected
                        ? "bg-[#6B4F6D] text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.ad?.charAt(0)?.toUpperCase()}
                    {item.soyad?.charAt(0)?.toUpperCase()}
                  </div>

           
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {`${item.ad?.charAt(0).toUpperCase()}${item.ad?.slice(
                        1
                      )} ${item.soyad?.charAt(0).toUpperCase()}${item.soyad?.slice(
                        1
                      )}`}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-400">
                      Mesajlaşma
                    </p>
                  </div>

      
                  <PersonRemoveIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(true);
                    }}
                    sx={{
                      fontSize: 20,
                    }}
                    className="cursor-pointer text-gray-300 opacity-0 transition-all duration-200 hover:text-[#6B4F6D] group-hover:opacity-100"
                  />

                  {open && (
                    <ChatScore
                      kullaniciId={item._id}
                      gonderenId={id}
                      setOpen={setOpen}
                    />
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex h-40 flex-col items-center justify-center text-center">
              <ChatBubbleOutlineIcon
                sx={{
                  fontSize: 32,
                  color: "#D1D5DB",
                }}
              />

              <p className="mt-3 text-sm text-gray-400">
                Kullanıcı bulunamadı
              </p>
            </div>
          )}
        </div>
      </aside>


      <main className="flex min-w-0 flex-1 flex-col bg-[#FCFBFD]">


        <header className="flex h-[72px] shrink-0 items-center border-b border-gray-200 bg-white px-6">
          {selectedUser ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EDE7F1] text-sm  text-[#6B4F6D]">
                {selectedUser?.ad?.charAt(0)?.toUpperCase()}
              </div>

              <div>
                <h2 className="text-sm  text-[#222C31]">
                  {selectedUser?.ad}
                </h2>

                <p className="text-xs text-gray-400">
                  Mesajlaşma
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-sm  text-[#222C31]">
                Mesajlar
              </h2>

              <p className="text-xs text-gray-400">
                Mesajlaşmaya başlamak için bir kullanıcı seçin
              </p>
            </div>
          )}
        </header>


        <div className="flex-1 overflow-y-auto px-6 py-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDE7F1]">
                <ChatBubbleOutlineIcon
                  sx={{
                    fontSize: 28,
                    color: "#6B4F6D",
                  }}
                />
              </div>

              <h3 className="mt-4 text-sm  text-[#222C31]">
                Henüz mesaj yok
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                İlk mesajı göndererek sohbeti başlatabilirsin.
              </p>
            </div>
          ) : (
            <div className="mx-auto flex max-w-4xl flex-col">
              {messages.map((msg, idx) => {
                const isMine = msg.gonderenId === id;

                return (
                  <div
                    key={idx}
                    className={`mb-3 flex ${
                      isMine
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                        isMine
                          ? "rounded-br-md bg-[#6B4F6D] text-white"
                          : "rounded-bl-md border border-gray-200 bg-white text-[#222C31]"
                      }`}
                    >
                      <p className="text-sm leading-6">
                        {msg.text}
                      </p>

                      <div
                        className={`mt-1 text-[10px] ${
                          isMine
                            ? "text-right text-white/60"
                            : "text-left text-gray-400"
                        }`}
                      >
                        {new Date(
                          msg.time
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>


        <div className="border-t border-gray-200 bg-white p-4">
          <form
            onSubmit={handleSend}
            className="mx-auto flex max-w-4xl items-center gap-3"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) =>
                setNewMessage(e.target.value)
              }
              placeholder="Mesajınızı yazın..."
              className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-[#F7F7F9] px-4 py-3 text-sm text-[#222C31] outline-none transition focus:border-[#C9B7CE] focus:bg-white focus:ring-2 focus:ring-[#EDE7F1]"
            />

            <Button
              type="submit"
              disabled={isSending}
              className="h-11 min-w-[110px] rounded-xl bg-[#6B4F6D] px-5 text-sm  text-white shadow-sm transition hover:bg-[#4E244D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending
                ? "Gönderiliyor..."
                : "Gönder"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
