import * as requestService from "../services/request.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { created, ok } from "../utils/respond.js";
import { serializeRequest } from "../utils/serializers.js";

function asOwner(request, viewer) {
  return serializeRequest(request, { viewerId: viewer.id, includeContact: true });
}

export const createRequest = asyncHandler(async (req, res) => {
  const request = await requestService.createRequest(req.user.id, req.body);
  created(res, asOwner(request, req.user));
});

export const listRequests = asyncHandler(async (req, res) => {
  const { items, meta } = await requestService.listRequests(req.user, req.query);
  const includeContact = req.query.scope === "mine";
  ok(
    res,
    items.map((request) => serializeRequest(request, { viewerId: req.user.id, includeContact })),
    meta,
  );
});

export const getRequest = asyncHandler(async (req, res) => {
  const { request, includeContact } = await requestService.getRequest(req.user, req.params.id);
  ok(res, serializeRequest(request, { viewerId: req.user.id, includeContact }));
});

export const updateRequest = asyncHandler(async (req, res) => {
  const request = await requestService.updateRequest(req.user, req.params.id, req.body);
  ok(res, asOwner(request, req.user));
});

export const changeStatus = asyncHandler(async (req, res) => {
  const request = await requestService.changeStatus(req.user, req.params.id, req.body.status);
  ok(res, asOwner(request, req.user));
});
