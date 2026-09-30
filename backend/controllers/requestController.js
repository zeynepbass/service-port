import Aktif from "../models/Aktif.js";

export const createAktif = async (req, res) => {
  try {
    const {
      primaryKey,
      anaBaslik,
      veriler,
      ad,
      email,
      kullaniciId,
      telefonNo,
      konum,
      baslangicTarihi,
      bitisTarihi
    } = req.body;


    if (!Array.isArray(veriler) || veriler.length === 0) {
      return res.status(400).json({ message: "Veriler array halinde olmalı ve boş olamaz." });
    }


    const yeniAktif = new Aktif({
      primaryKey,
      anaBaslik,
      veriler,
      durum: "aktif",
      ad,
      email,
      kullaniciId,
      telefonNo,
      konum,
      baslangicTarihi: baslangicTarihi || new Date(),
      bitisTarihi: bitisTarihi || null,
    });

    const kayit = await yeniAktif.save();

    res.status(201).json({
      _id: kayit._id,
      primaryKey: kayit.primaryKey,
      anaBaslik: kayit.anaBaslik,
      veriler: kayit.veriler,
      durum: kayit.durum,
      ad: kayit.ad,
      
      email: kayit.email,
      kullaniciId: kayit.kullaniciId,
      telefonNo: kayit.telefonNo,
      konum: kayit.konum,
      baslangicTarihi: kayit.baslangicTarihi,
      bitisTarihi: kayit.bitisTarihi,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Aktif kaydı eklenirken hata oluştu." });
  }
};


export const getAktif=async(req,res)=>{

    try {
      const aktif = await Aktif.find(); 
     
      res.status(200).json(aktif);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "aktifler alınamadı." });
    }
  
}
export const getAktifById = async (req, res) => {
  try {
    const { primaryKey } = req.params;

    const aktif = await Aktif.findOne({ primaryKey });

    if (!aktif) {
      return res.status(404).json({ message: "Aktif bulunamadı." });
    }

    res.status(200).json(aktif);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Aktif alınamadı." });
  }
};



export const updateAktif = async (req, res) => {
  try {
    const { primaryKey } = req.params; 
    const {telefonNo, konum, bitisTarihi } = req.body;

    if (!primaryKey) {
      return res.status(400).json({ message: "ID eksik." });
    }

    const aktif = await Aktif.findOne({primaryKey});


    if (!aktif) {
      return res.status(404).json({ message: "aktif bulunamadı." });
    }

    if (telefonNo) aktif.telefonNo = telefonNo;
    if (konum) aktif.konum = konum;

if(bitisTarihi) aktif.bitisTarihi=bitisTarihi;
    const kayit = await aktif.save();
    res.status(200).json(kayit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "aktifler güncellenemedi." });
  }
};

export const updateDurum = async (req, res) => {
  try {
    const { id } = req.params;
    const { durum } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID eksik." });
    }

    if (!["aktif", "pasif", "iptal"].includes(durum)) {
      return res.status(400).json({ message: "Geçersiz durum değeri. Sadece 'aktif', 'pasif' veya 'iptal' olabilir." });
    }

    const aktif = await Aktif.findById(id);
    if (!aktif) {
      return res.status(404).json({ message: "Kayıt bulunamadı." });
    }

    aktif.durum = durum;

    const kayit = await aktif.save();
    res.status(200).json(kayit);

  } catch (error) {
    console.error("Durum güncellenemedi:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};


