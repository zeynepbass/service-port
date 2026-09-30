
import apiClient from "@/shared/api/client";


export async function updateScore  (kullaniciId, rating, comment){
  const { data } = await apiClient.put(`/degerlendirme/${kullaniciId}`, {
    rating,
    comment,
  });

  return data;
};


export async function getConversations  (aliciId){
  const { data } = await apiClient.get(`/konusmalar/${aliciId}`);

  return data || [];
};


export async function deleteMessage(gonderenId, userId){
  const { data } = await apiClient.delete(
    `/${gonderenId}/${userId}`
  );

  return data;
};


export async function getMessages  (gonderenId, selectedUser){
  const { data } = await apiClient.get(
    `/mesajlar/${gonderenId}/${selectedUser}`
  );

  return data || [];
};


export async function sendMessage  (msgData){
  const { data } = await apiClient.post("/mesajlar", msgData);

  return data;
};


export async function updateActive  (id, formData){
  const { data } = await apiClient.put(
    `/aktifUpdated/${id}`,
    formData
  );

  return data;
};


export async function getRenovationById  (id){
  const { data } = await apiClient.get(`/tadilat/${id}`);

  return data;
};


export async function updateStatus  (
  id,
  currentShowText,
  forceCancel = false
){
  const newStatus = forceCancel
    ? "iptal"
    : currentShowText
      ? "pasif"
      : "aktif";

  const { data } = await apiClient.put(
    `/aktifTadilat/durum/${id}`,
    {
      durum: newStatus,
    }
  );

  return {
    ...data,
    newStatus,
  };
};


export async function getActiveRenovations(){
  const { data } = await apiClient.get("/aktifTadilat");

  return data;
};




export async function createActiveRenovation  (item){
  const { data } = await apiClient.post(
    "/aktifTadilat",
    item
  );

  return data;
};


export async function getCategories  (){
  const { data } = await apiClient.get("/kategori");

  return data || [];
};

