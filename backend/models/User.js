import mongoose from "mongoose";

const kullaniciSchema = new mongoose.Schema({
  ad: { type: String},
  soyad: { type: String},
  email: { type: String },
  parola: { type: String },
  kullaniciAdi: { type: String },
  rating:{ type: Number,default:0 },
  comment:{ type: String,default:null },
  resim: { type: String,default:null},
  hesap: { type: String,default:true},
  telefon: { type: String,default:null},
  id:{type:String}
});

const Kullanici = mongoose.model("Kullanici", kullaniciSchema);

export default Kullanici; 
