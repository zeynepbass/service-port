import { useRouter } from "next/navigation";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { Button } from "@/shared/components/atoms";

export function HomeIsCard({ item, showText, handleSubmit }) {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-between p-4  bg-white border border-gray-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
      
      <form onSubmit={(e) => handleSubmit(e, item._id)}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg  text-gray-600">
            {item.anaBaslik}
          </h3>

          <Button type="submit">
            {showText[item._id] ? (
              <ToggleOnIcon className="text-[rgb(34,44,49)]" />
            ) : (
              <ToggleOffIcon className="text-[rgb(242,247,250)]" />
            )}
          </Button>
        </div>
      </form>

      {item.veriler?.map((veri, i) => (
        <div
          key={i}
          className="mb-3 cursor-pointer"
          onClick={() =>
            router.push(`/hizmet/${item.primaryKey}`)
          }
        >
          <p className=" text-gray-700">
            {veri.kategoriIsim}: {veri.secilen}
          </p>

          <p className="text-sm text-gray-600 mt-1">
            <span className="font-medium text-[rgb(78,36,77)]">
              Seçenekler:
            </span>{" "}
            {veri.secenekler.join(", ")}
          </p>
        </div>
      ))}

      <div className="mt-4 pt-2 border-t border-gray-200 text-sm text-gray-600 space-y-1">
        <p>
          <span className="font-medium text-gray-700">
            Telefon:
          </span>{" "}
          {item.telefonNo || "Belirtilmemiş"}
        </p>

        <p>
          <span className="font-medium text-gray-700">
            Konum:
          </span>{" "}
          {item.konum || "Belirtilmemiş"}
        </p>

        <p>
          <span className="font-medium text-gray-700">
            Durumu:
          </span>{" "}
          <span
            className={
              item.durum === "iptal"
                ? "text-red-600 "
                : item.durum === "aktif"
                ? "text-[rgb(34,44,49)] "
                : item.durum === "pasif"
                ? "text-[rgb(34,44,49)]"
                : "text-gray-400"
            }
          >
            {item.durum || "Belirtilmemiş"}
          </span>
        </p>

        <p>
          <span className="font-medium text-gray-700">
            Süre:
          </span>{" "}
          {item.baslangicTarihi && item.bitisTarihi
            ? `${new Date(
                item.baslangicTarihi
              ).toLocaleDateString("tr-TR")} - ${new Date(
                item.bitisTarihi
              ).toLocaleDateString("tr-TR")}`
            : "süresiz"}
        </p>
      </div>
    </div>
  );
}