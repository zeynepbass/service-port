
"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { Button } from "@/shared/components/atoms";

import { ServiceContactForm } from "../components/ServiceContactForm";
import { ServiceDetails } from "../components/ServiceDetails";
import { ServiceOptions } from "../components/ServiceOptions";
import { ServiceMessageUsers } from "../components/ServiceMessageUsers";

import { useService } from "../hooks/useService";
import { Loading } from "@/shared/components/molecules";

export default function Service({ paramsId }) {
  const {
    storedData,
    filteredData,

    location,
    phone,
    sure,
    promptPhone,

    setPhone,
    setSure,

    handleGetLocation,
    handleGetPhone,
    handleGetCalendar,
    handleSubmit,
    handleBack,

    isLoading,
    isUpdating,
  } = useService(paramsId);

  if (isLoading) {
    return <Loading/>
  }

  return (
    <>
      <Button
        onClick={handleBack}
        className="ml-4 cursor-pointer text-[rgb(237,203,206)]"
      >
        <ArrowBackIcon sx={{ fontSize: 25 }} />
      </Button>

      <div className="flex flex-col items-center mx-auto gap-6 min-h-[100vh]">
        <div className="w-full max-w-xlg text-center h-[100vh] overflow-auto">

          <ServiceContactForm
            location={location}
            phone={phone}
            sure={sure}
            promptPhone={promptPhone}
            setPhone={setPhone}
            setSure={setSure}
            handleGetLocation={handleGetLocation}
            handleGetPhone={handleGetPhone}
            handleGetCalendar={handleGetCalendar}
            handleSubmit={handleSubmit}
            isUpdating={isUpdating}
          />

          <ServiceDetails data={storedData} />

          <ServiceOptions
            options={storedData?.veriler}
          />

          <ServiceMessageUsers
            users={filteredData}
          />

        </div>
      </div>
    </>
  );
}

