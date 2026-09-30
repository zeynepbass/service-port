
"use client";

import { RequestForm } from "../components/RequestForm";
import { RequestSuccess } from "../components/RequestSuccess";
import { RequestExitModal } from "../components/RequestExitModal";
import { useRequest } from "../hooks/useRequest";
import { Loading } from "@/shared/components/molecules";

export default function Request({ id }) {
  const {
    open,
    dialog,
    currentStep,
    answers,
    showRequestExitModal,

    steps,
    item,
    storedData,

    progressPercent,

    isLoading,

    handleAnswer,
    handleBack,
    handleNext,
    handleClick,
    handleClose,
    handleExit,

    setShowRequestExitModal,
  } = useRequest(id);

  if (isLoading) {
    return<Loading/>
  }

  return (
    <div className="w-full justify-center">
      {open ? (
        <RequestSuccess
          dialog={dialog}
          handleClose={handleClose}
          handleClick={handleClick}
          storedData={storedData}
        />
      ) : (
        <RequestForm
          item={item}
          steps={steps}
          currentStep={currentStep}
          answers={answers}
          progressPercent={progressPercent}
          handleAnswer={handleAnswer}
          handleNext={handleNext}
          handleBack={handleBack}
          setShowExitModal={setShowRequestExitModal}
        />
      )}

      <RequestExitModal
        open={showRequestExitModal}
        onClose={() =>
          setShowRequestExitModal(false)
        }
        onExit={handleExit}
      />
    </div>
  );
}

