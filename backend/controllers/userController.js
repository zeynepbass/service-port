import Kullanici from "../models/kullanici.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import jwt from "jsonwebtoken";


export const degerlendirmeGuncelleByUser = async (req, res) => {
  try {
    const { id } = req.params; // Postman’de gönderilen id
    const { rating, comment } = req.body;

    if (rating == null)
      return res.status(400).json({ message: "Rating zorunlu" });

    // MongoDB _id kullanıyorsan:
    const user = await Kullanici.findById(id);

    // Eğer kendi id alanına göre arayacaksan:
    // const user = await Kullanici.findOne({ id: id });

    if (!user)
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    user.rating = rating;
    user.comment = comment || user.comment;

    await user.save();

    res.status(200).json({
      message: "Değerlendirme kaydedildi",
      rating: user.rating,
      comment: user.comment,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Değerlendirme kaydedilemedi", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, parola } = req.body;


    const kullanici = await Kullanici.findOne({ email });
    if (!kullanici) {
      return res.status(400).json({ message: "Email bulunamadı" });
    }


    const match = await bcrypt.compare(parola, kullanici.parola);
    if (!match) {
      return res.status(400).json({ message: "Parola yanlış" });
    }


    const token = jwt.sign(
      { id: kullanici._id, email: kullanici.email },
      process.env.JWT_SECRET || "secretkey123",
      { expiresIn: "1d" }
    );


    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, 
    });


    res.status(200).json({
      message: "Giriş başarılı",
      kullanici: {
        id: kullanici._id,
        ad: kullanici.ad,
        email: kullanici.email,
      },
      token, 
    });
  } catch (error) {
    res.status(500).json({ message: "Giriş yapılamadı", error: error.message });
  }
};
export const kullanicilariListele = async (req, res) => {
    try {
      const kullanicilar = await Kullanici.find().select("-parola");
      res.status(200).json({ kullanicilar });
    } catch (error) {
      res.status(500).json({ message: "Kullanıcılar getirilemedi", error: error.message });
    }
  };

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads"); 
      
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });
  
  export const upload = multer({ storage });
  
  export const kayitOl = async (req, res) => {
    try {
      const { ad, soyad, email, parola, telefon } = req.body;
  
      if (!email || !parola) {
        return res.status(400).json({ message: "Email ve parola gerekli" });
      }
  
      const mevcutKullanici = await Kullanici.findOne({ email });
      if (mevcutKullanici) {
        return res.status(400).json({ message: "Bu email zaten kayıtlı" });
      }
  
      const hashedParola = await bcrypt.hash(parola, 10);
  
      const yeniKullanici = new Kullanici({
        ad: ad || "",
        soyad: soyad || "",
        email,
        parola: hashedParola,
        telefon,
        resim: req.file ? req.file.filename : null,
      });
  
      await yeniKullanici.save();

      res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu", yeniKullanici });
    } catch (error) {
      res.status(500).json({ message: "Kullanıcı oluşturulamadı", error: error.message });
    }
  };


export const smsGonder = async (req, res) => {
    try {
      const { kullaniciAdi } = req.body;
      if (!kullaniciAdi) return res.status(400).json({ message: "Kullanıcı adı gerekli" });
  
      const mevcutKullanici = await Kullanici.findOne({ kullaniciAdi });
      if (mevcutKullanici) {
        return res.status(400).json({ message: "Bu kullanıcı adı zaten kayıtlı" });
      }
  
      const kullaniciAdiParola = Math.floor(1000 + Math.random() * 9000).toString();
      const hashedParola = await bcrypt.hash(kullaniciAdiParola, 10);
  

      const yeniKullanici = new Kullanici({
        kullaniciAdi,
        parola: hashedParola
      });
      await yeniKullanici.save();
  
      res.status(200).json({ message: "Kullanıcı oluşturuldu", kullaniciAdiParola,kullaniciAdi });
    } catch (error) {
      res.status(500).json({ message: "Kullanıcı gönderilemedi", error: error.message });
    }
  };
  


export const sifreGuncelle = async (req, res) => {
  try {
    const { email, yeniParola, yeniParolaTekrar } = req.body;

    if (!email || !yeniParola || !yeniParolaTekrar) {
      return res.status(400).json({ message: "Email ve her iki yeni parola gerekli" });
    }

    if (yeniParola !== yeniParolaTekrar) {
      return res.status(400).json({ message: "Yeni şifreler eşleşmiyor" });
    }


    const kullanici = await Kullanici.findOne({ email });
    if (!kullanici) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }


    const hashedParola = await bcrypt.hash(yeniParola, 10);
    kullanici.parola = hashedParola;
    await kullanici.save();

    res.status(200).json({ message: "Şifre başarıyla güncellendi" });
  } catch (error) {
    res.status(500).json({ message: "Şifre güncellenemedi", error: error.message });
  }
};

export const kullaniciSil = async (req, res) => {
  try {
    const { id } = req.params; 

    const kullanici = await Kullanici.findById(id);
    if (!kullanici) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    await Kullanici.findByIdAndDelete(id);

    res.status(200).json({ message: "Kullanıcı başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı silme işlemi başarısız", error: error.message });
  }
};
export const kullaniciDetay = async (req, res) => {
  try {
    const { id } = req.params;
    const detay = await Kullanici.findById(id);
    if (!detay) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    res.status(200).json(detay);
  } catch (err) {
    res.status(500).json({ message: "Detaylar getirilemedi", error: err.message });
  }
};




export const kullaniciGuncelle = [
  upload.single("resim"), 
  async (req, res) => {
    try {
      const { id } = req.params;
      const { ad, soyad, email, parola, kullaniciAdi, hesap, aktif, telefon } = req.body;

      const updateData = {
        ad,
        soyad,
        email,
        kullaniciAdi,
        hesap,
        aktif,
        telefon,
      };
      if (req.file) {
        updateData.resim = req.file.filename;
      }
      
      if (parola) {
        const hashedParola = await bcrypt.hash(parola, 10);
        updateData.parola = hashedParola;
      }

      const guncellenmisKullanici = await Kullanici.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!guncellenmisKullanici) {
        return res.status(404).json({ message: "Kullanıcı bulunamadı" });
      }

      res.status(200).json({
        message: "Kullanıcı başarıyla güncellendi",
        kullanici: guncellenmisKullanici
      });
    } catch (error) {
      res.status(500).json({
        message: "Kullanıcı güncellenemedi",
        error: error.message
      });
    }
  },
];

