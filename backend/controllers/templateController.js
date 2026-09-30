
import Tadilat from "../models/TadilatModel.js";
import Kategori from "../models/Kategori.js";
import mongoose from "mongoose";
  //!güncelleme 
  export const updateTadilat = async (req, res) => {
    try {
      const { id } = req.params;
      const { durum } = req.body;
  
      const tadilat = await Tadilat.findById(id);
  
      if (!tadilat) {
        return res.status(404).json({ message: "Tadilat bulunamadı." });
      }
  

      if (durum === "iptal") {
        tadilat.durum = "iptal";
      }
  

      const bugun = new Date();
      const bitirme = new Date(tadilat.bitirmeTarihi);
      if (bitirme < bugun.setHours(0,0,0,0) && tadilat.durum !== "iptal") {
        tadilat.durum = "pasif";
      } else if (bitirme >= bugun.setHours(0,0,0,0) && tadilat.durum !== "iptal") {
        tadilat.durum = "aktif";
      }
  
      const kayit = await tadilat.save();
      res.status(200).json(kayit);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Tadilat güncellenemedi." });
    }
  };

  export const createTadilat = async (req, res) => {
    try {
      let { kategori, adimlar, bitirmeTarihi } = req.body;
  
      // kategori ObjectId doğrulama
      const kategoriDoc = await Kategori.findById(kategori);
      if (!kategoriDoc) {
        return res.status(404).json({ message: "Kategori bulunamadı!" });
      }
  
      bitirmeTarihi = bitirmeTarihi ? new Date(bitirmeTarihi) : null;
      let durum = "aktif";
      if (bitirmeTarihi && bitirmeTarihi < new Date()) durum = "pasif";
  
      // adimlar.secilen boşsa null yap
      adimlar = adimlar.map(adim => ({
        ...adim,
        secilen: adim.secilen || null
      }));
  
      const yeniTadilat = new Tadilat({
        kategori,
        adimlar,
        bitirmeTarihi,
        durum
      });
  
      const kayit = await yeniTadilat.save();
  
      // populate ile kategori nesnesi ekle
      await kayit.populate("kategori");
  
      res.status(201).json(kayit);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Tadilat eklenirken hata oluştu." });
    }
  };
  
  
  
  
    // !LİST APİSİ
    export const listTadilat = async (req, res) => {
      try {
        const tadilatlar = await Tadilat.find().populate("kategori"); 
       
        res.status(200).json(tadilatlar);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Tadilatlar alınamadı." });
      }
    };
  //! GET APİSİ
    export const getTadilatById = async (req, res) => {
      try {
        const { kategoriId } = req.params;
    
        if (!mongoose.Types.ObjectId.isValid(kategoriId)) {
          return res.status(400).json({ message: "Geçersiz kategoriId" });
        }
    
        const tadilatlar = await Tadilat.find({ kategori: kategoriId }).populate("kategori");
    
        if (!tadilatlar || tadilatlar.length === 0) {
          return res.status(404).json({ message: "Bu kategoriye ait tadilat bulunamadı." });
        }
    
        res.status(200).json(tadilatlar);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Tadilatlar alınamadı." });
      }
    };
  
  

    