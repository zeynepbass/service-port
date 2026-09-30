
"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

import { useAccountDetails } from "../../hooks/useAccountDetails";
import { Button } from "@/shared/components/atoms";

export function AccountDetails() {
  const {
    data,
    kullaniciAdi,
    handleSettings,
  } = useAccountDetails();
 
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        width: "100%",
        padding: "10px 12px",
        borderRadius: "14px",
        backgroundColor: "#F7F7F9",
        border: "1px solid #E5E5E7",
        boxShadow: "none",
      }}
    >

      {kullaniciAdi ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E1D7E5] text-sm  uppercase text-[#4E244D]">
  {kullaniciAdi?.ad?.slice(0, 2).toUpperCase()}
        </div>
      ) : data.resim ? (
        <CardMedia
          component="img"
          sx={{
            width: 40,
            height: 40,
            borderRadius: "12px",
            objectFit: "cover",
            flexShrink: 0,
          }}
          image={`http://localhost:6398/uploads/${data.resim}`}
          alt="Kullanıcı resmi"
        />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E1D7E5] text-sm  text-[#4E244D]">
          {data.ad?.[0] || "?"}
        </div>
      )}


      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          flex: 1,
        }}
      >
        <Typography
          component="div"
          sx={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#374151",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {data.ad} {data.soyad}
        </Typography>

        <Typography
          component="div"
          sx={{
            fontSize: "11px",
            color: "#9CA3AF",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {data.email}
        </Typography>

<Button
        type="button"
        onClick={handleSettings}
        className="mt-1 w-fit text-md font-medium text-[#6B4F6D] transition hover:text-[#4E244D]"
   
>       Ayarlar</Button>

      </Box>
    </Card>
  );
}

