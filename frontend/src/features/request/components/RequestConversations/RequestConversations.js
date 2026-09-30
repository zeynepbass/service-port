"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

export function ServiceMessageUsers({ users }) {
  return (
    <div className="mt-6">
      <span className="text-xl  text-gray-600">
        Mesajlar
      </span>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Card
          sx={{
            display: "flex",
            mt: 2,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {users?.map((item) => (
            <div key={item._id} className="flex">
              {item.resim && (
                <CardMedia
                  component="img"
                  sx={{ width: 140 }}
                  image={item.resim}
                  alt=""
                />
              )}

              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography component="div" variant="h6">
                  {item.ad?.toUpperCase()}{" "}
                  {item.soyad?.toUpperCase()}
                </Typography>

                <Typography
                  variant="subtitle1"
                  component="div"
                  sx={{ color: "text.secondary" }}
                >
                  {item.email}
                </Typography>
              </CardContent>
            </div>
          ))}
        </Card>
      </Box>
    </div>
  );
}