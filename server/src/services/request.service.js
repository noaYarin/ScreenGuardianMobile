import { AppError } from "../utils/appError.js";
import { Common as CommonErrors, Request as RequestErrors } from "../constants/errors.js";
import { RequestStatus } from "../constants/status.js";

import DeviceModel from "../models/device.model.js";
import * as requestDal from "../dal/request.dal.js";

import { assertValidObjectId } from "../utils/validators.js";

const MIN_MINUTES = 1;
const MAX_MINUTES = 120;

function assertMinutes(minutes) {
    const n = Number(minutes);
    if (!Number.isFinite(n) || n < MIN_MINUTES || n > MAX_MINUTES) {
        throw new AppError(RequestErrors.INVALID_MINUTES);
    }
    return n;
}

function assertDecision(decision) {
    if (
        decision !== RequestStatus.APPROVED &&
        decision !== RequestStatus.REJECTED
    ) {
        throw new AppError(RequestErrors.INVALID_DECISION);
    }
}

async function assertDeviceBelongsToChild({ deviceId, parentId, childId }) {
    const device = await DeviceModel.findById(deviceId).lean();

    if (!device) {
        throw new AppError(CommonErrors.DEVICE_NOT_FOUND);
    }

    if (String(device.parentId) !== String(parentId)) {
        throw new AppError(RequestErrors.DEVICE_NOT_OWNED);
    }

    if (String(device.childId) !== String(childId)) {
        throw new AppError(RequestErrors.DEVICE_NOT_OWNED);
    }

    return device;
}

export async function createRequest({ parentId, childId, deviceId, requestedMinutes, reason }) {

    assertValidObjectId(parentId, CommonErrors.INVALID_PARENT_ID);
    assertValidObjectId(childId, CommonErrors.INVALID_CHILD_ID);
    assertValidObjectId(deviceId, CommonErrors.INVALID_DEVICE_ID);

    const minutes = assertMinutes(requestedMinutes);

    await assertDeviceBelongsToChild({ deviceId, parentId, childId });

    // check duplicate pending request
    const existingPending = await requestDal.findPendingRequestForDevice({
        parentId,
        childId,
        deviceId
    });

    if (existingPending) {
        throw new AppError(RequestErrors.REQUEST_ALREADY_PENDING);
    }

    return requestDal.createRequestDoc({
        parentId,
        childId,
        deviceId,
        requestedMinutes: minutes,
        reason: reason ?? "",
        status: RequestStatus.PENDING
    });
}

export async function getChildRequests({ parentId, childId, status }) {

    assertValidObjectId(parentId, CommonErrors.INVALID_PARENT_ID);
    assertValidObjectId(childId, CommonErrors.INVALID_CHILD_ID);

    if (status) {
        const allowed = new Set(Object.values(RequestStatus));
        if (!allowed.has(status)) {
            throw new AppError(CommonErrors.VALIDATION_ERROR);
        }
    }

    return requestDal.findRequestsByChild({
        parentId,
        childId,
        status
    });
}

export async function getPendingRequests({ parentId, childId }) {

    assertValidObjectId(parentId, CommonErrors.INVALID_PARENT_ID);

    if (childId) {
        assertValidObjectId(childId, CommonErrors.INVALID_CHILD_ID);
    }

    return requestDal.findPendingRequestsByParent({
        parentId,
        childId
    });
}

export async function decideRequest({ parentId, requestId, decision }) {

    assertValidObjectId(parentId, CommonErrors.INVALID_PARENT_ID);
    assertValidObjectId(requestId, RequestErrors.INVALID_REQUEST_ID);

    assertDecision(decision);

  //update only if still pending
    const updated  = await requestDal.updateRequestDecisionIfPending({
        requestId,
        parentId,
        decision
    });

   if (updated) return updated;

  // If not updated- then why
  const existing = await requestDal.findRequestByIdForParent({ requestId, parentId });

  if (!existing) {
    throw new AppError(RequestErrors.REQUEST_NOT_FOUND);
  }

  // request exist but not pending
  throw new AppError(RequestErrors.REQUEST_NOT_PENDING);

}