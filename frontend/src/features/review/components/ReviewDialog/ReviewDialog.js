
"use client";

import { useState } from "react";
import { Rating } from "@mui/material";
import { useRouter } from "next/navigation";
import { Button, Heading } from "@/shared/components/atoms";
import { updateScore, deleteMessage } from "../../api/post.api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function ChatScore({
  kullaniciId,
  setOpen,
  gonderenId,
  setMessages,
  setUserList,
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const router = useRouter();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.warning("Lütfen bir yıldız seçin.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await updateScore(
        kullaniciId,
        rating,
        comment
      );

      if (!response) {
        throw new Error("API'den cevap alınamadı");
      }

      toast.success("Değerlendirme başarıyla kaydedildi!", {
        position: "top-right",
        autoClose: 3000,
      });

      if (setOpen) {
        setOpen(false);
      }

      router.back();
    } catch (err) {
      console.error("Değerlendirme gönderilemedi:", err);

      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async (gonderenId, kullaniciId) => {
    try {
      const res = await deleteMessage(gonderenId, kullaniciId);

      if (res) {
        setMessages([]);
        setUserList("");
        router.push("/ana-sayfa");
      } else {
        console.error("Mesaj silinemedi");
      }
    } catch (error) {
      console.error("Mesaj silme hatası:", error);

      toast.error("Sohbet silinemedi. Lütfen tekrar deneyin.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#222C31]/40 px-4 backdrop-blur-sm">

      <ToastContainer />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">


        <div className="border-b border-gray-100 px-6 py-5">
          <div className="pr-8">
            <Heading
              variant="dark"
              title="Hizmeti Değerlendir"
              desc="Aldığın hizmet hakkında değerlendirme yapabilirsin."
            />
          </div>

          <Button
            onClick={() => router.back()}
            type="button"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-lg text-gray-400 transition-all duration-200 hover:bg-[#F7F7F9] hover:text-[#4E244D]"
          >
            ✕
          </Button>
        </div>


        <div className="px-6 py-6">


          <div className="rounded-2xl bg-[#FCFBFD] p-5 text-center">
            <p className="mb-3 text-sm font-medium text-[#222C31]">
              Hizmetten memnun kaldın mı?
            </p>

            <Rating
              name="rating"
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
              sx={{
                "& .MuiRating-iconFilled": {
                  color: "#6B4F6D",
                },
                "& .MuiRating-iconHover": {
                  color: "#4E244D",
                },
              }}
            />

            <p className="mt-2 text-xs text-gray-400">
              {rating === 0
                ? "Puan vermek için yıldız seç"
                : `${rating} / 5 puan`}
            </p>
          </div>


          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-[#222C31]">
              Yorum
              <span className="ml-1 font-normal text-gray-400">
                (opsiyonel)
              </span>
            </label>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="İstersen deneyimini paylaşabilirsin..."
              rows={4}
              className="w-full resize-none rounded-xl border border-gray-200 bg-[#F7F7F9] px-4 py-3 text-sm text-[#222C31] outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#C9B7CE] focus:bg-white focus:ring-2 focus:ring-[#EDE7F1]"
            />
          </div>


          <Button
            type="button"
            onClick={handleSubmit}
            className="mt-5 w-full rounded-xl bg-[#6B4F6D] py-3 text-sm  text-white shadow-sm transition-all duration-200 hover:bg-[#4E244D]"
          >
            Değerlendirmeyi Gönder
          </Button>


          <div className="mt-5 border-t border-gray-100 pt-5">
            <Button
              type="button"
              onClick={() =>
                handleDelete(gonderenId, kullaniciId)
              }
              className="w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-500 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
            >
              Sohbeti Sil
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
