
import apiClient from "@/shared/api/client";


export async function updateAccount  (id, durum = false) {
  const { data } = await apiClient.put(`/hesap/${id}`, {
    hesap: durum,
  });

  return data;
};


export async function register  (formData) {
  const { data } = await apiClient.post("/kayit", formData);

  return data;
};


export async function deleteAccount  (id) {
  const { data } = await apiClient.delete(`/hesapSil/${id}`);

  return data;
};


export async function forgotPassword  (formData) {
  const { data } = await apiClient.post("/sifremi-unuttum", formData);

  return data;
};


export async function updateAccountInfo  (id, formData) {
  const { data } = await apiClient.put(`/hesap/${id}`, formData);

  return data;
};


export async function Login  (formData) {
  const { data } = await apiClient.post("/login", formData);

  return data;
};


export async function sendPassword  (formData) {
  const { data } = await apiClient.post("/sifre-gonder", formData);

  return data;
};


export async function getUsers  () {
  const { data } = await apiClient.get("/kullanicilar");

  return data.kullanicilar || [];
};


export async function getUserDetails  (id) {
  const { data } = await apiClient.get(`/kullanici/${id}`);

  return data;
};

