import mongoose from "mongoose";

const stepSchema = new mongoose.Schema({
  baslik: { type: String, required: true }, 
  secenekler: [{ type: String }], 
  secilen: { type: String, default: null }
            
});

const tadilatSchema = new mongoose.Schema({
  kategori: { type: mongoose.Schema.Types.ObjectId, ref: "Kategori" },
  adimlar: [stepSchema],                   
  tarih: { type: Date, default: Date.now },
  bitirmeTarihi: { type: Date, default: null },
  durum: { type: String, enum: ["aktif", "pasif", "iptal"], default: "aktif" }
});

const Tadilat = mongoose.model("Tadilat", tadilatSchema);

export default Tadilat;
