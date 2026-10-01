"use client";

import { useSession } from "@/features/auth/hooks/useSession";
import { Loading } from "@/shared/components/molecules";
import { fullName, initials } from "@/shared/utils/format";
import { ProfileForm } from "../components/ProfileForm";
import { ProfileImage } from "../components/ProfileImage";
import { useProfileForm } from "../hooks/useProfileForm";

export default function ProfilePage() {
  const { user, isLoading } = useSession();
  const { form, onSubmit, selectAvatar, avatarSrc, avatarError, isSaving } = useProfileForm(user);

  if (isLoading || !user) return <Loading />;

  return (
    <main className="min-h-screen bg-[#F7F7F9] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-[#6B4F6D]">Hesap</p>
          <h1 className="text-2xl tracking-tight text-gray-800 sm:text-3xl">Profil Bilgileri</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Kişisel bilgilerini ve profil fotoğrafını buradan güncelleyebilirsin.
          </p>
          {user.ratingCount > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              Ortalama puanın: {user.ratingAverage} / 5 ({user.ratingCount} değerlendirme)
            </p>
          )}
        </div>

        <section
          aria-labelledby="personal-info"
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="border-b border-gray-100 bg-[#FCFBFD] px-6 py-5 sm:px-8">
            <h2 id="personal-info" className="text-base text-gray-800">
              Kişisel Bilgiler
            </h2>
            <p className="mt-1 text-sm text-gray-500">Profilinde görüntülenecek bilgileri düzenle.</p>
          </div>
          <div className="grid gap-10 px-6 py-8 sm:px-8 lg:grid-cols-[220px_1fr]">
            <ProfileImage
              src={avatarSrc}
              name={fullName(user)}
              fallback={initials(user)}
              onSelect={selectAvatar}
              error={avatarError}
            />
            <ProfileForm form={form} onSubmit={onSubmit} isSaving={isSaving} />
          </div>
        </section>
      </div>
    </main>
  );
}
