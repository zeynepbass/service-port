"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/queryKeys";
import { changeRequestStatus } from "../api/request.api";
import { STATUS_LABELS } from "../utils/status";

export function useChangeRequestStatus() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, status }) => changeRequestStatus(id, status),
    onSuccess: (request) => {
      queryClient.setQueryData(queryKeys.request(request.id), request);
      queryClient.invalidateQueries({ queryKey: queryKeys.requestsRoot });
      toast.success(`Talep durumu: ${STATUS_LABELS[request.status]}`);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Talep durumu güncellenemedi")),
  });

  return {
    changeStatus: (id, status) => mutation.mutate({ id, status }),
    changeStatusAsync: (id, status) => mutation.mutateAsync({ id, status }),
    pendingId: mutation.isPending ? mutation.variables?.id : null,
  };
}
