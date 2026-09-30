import mongoose from "mongoose";

const kategoriSchema = new mongoose.Schema({
  resim: { type: String, required: true },
  isim: { type: String, required: true },
  aciklama: { type: String },
});

const Kategori = mongoose.model("Kategori", kategoriSchema);

export default Kategori; 
