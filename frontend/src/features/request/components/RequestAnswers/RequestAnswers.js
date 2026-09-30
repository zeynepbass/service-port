export function ServiceOptions({ options }) {
    return (
      <ul className="list-none space-y-4">
        <div className="flex flex-wrap gap-3">
          <ul className="space-y-4 w-full">
            {options?.map((item) => (
              <li
                key={item._id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition w-full"
              >
                <div className="flex flex-col">
                  <span className=" text-gray-600">
                    {item.kategoriIsim || "Kategori belirtilmemiş"}
                  </span>
  
                  {Array.isArray(item.secenekler) &&
                    item.secenekler.length > 0 && (
                      <span className="text-gray-500 text-sm">
                        Seçenekler: {item.secenekler.join(", ")}
                      </span>
                    )}
                </div>
  
                <div className="flex items-center gap-4 mt-2 md:mt-0">
                  <span className="font-medium text-[rgb(78,36,77)]">
                    Seçilen: {item.secilen || "Yok"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </ul>
    );
  }