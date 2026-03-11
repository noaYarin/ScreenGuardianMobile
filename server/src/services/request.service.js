import { AppError } from "../utils/appError.js";
import { Common as CommonErrors, Request as RequestErrors } from "../constants/errors.js";
import { RequestStatus } from "../constants/status.js";
import * as requestDal from "../dal/request.dal.js";
import { assertValidObjectId } from "../utils/validators.js";
import { NotificationSeverity } from "../constants/severity.js";
import { NotificationType } from "../constants/notificationType.js";
import { notifyParent, notifyChild } from "../services/notification.service.js";
import { addExtraMinutesToDevice, findDeviceById } from "../dal/device.dal.js";

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
    const device = await findDeviceById(deviceId);

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

    const request = await requestDal.createRequestDoc({
        parentId,
        childId,
        deviceId,
        requestedMinutes: minutes,
        reason: reason ?? "",
        status: RequestStatus.PENDING
    });


    await notifyParent({
        parentId,
        childId,
        type: NotificationType.EXTENSION_REQUEST_CREATED,
        severity: NotificationSeverity.INFO,
        title: "בקשת הארכה חדשה",
        description: "הילד שלח בקשת הארכת זמן"
    });
    return request;
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
    const updated = await requestDal.updateRequestDecisionIfPending({
        requestId,
        parentId,
        decision
    });

    if (updated) {
        if (decision === RequestStatus.APPROVED) {
            await addExtraMinutesToDevice(
                updated.deviceId,
                Number(updated.requestedMinutes || 0)
            );
        }
        await notifyChild({
            parentId: updated.parentId,
            childId: updated.childId,
            type: decision === RequestStatus.APPROVED
                ? NotificationType.EXTENSION_REQUEST_APPROVED
                : NotificationType.EXTENSION_REQUEST_REJECTED,
            severity: NotificationSeverity.INFO,
            title: decision === RequestStatus.APPROVED
                ? "בקשת ההארכה אושרה"
                : "בקשת ההארכה נדחתה",
            description: decision === RequestStatus.APPROVED
                ? "ההורה אישר את בקשת ההארכה"
                : "ההורה דחה את בקשת ההארכה"
        });

        return updated;
    }
    // If not updated- then why
    const existing = await requestDal.findRequestByIdForParent({ requestId, parentId });

    if (!existing) {
        throw new AppError(RequestErrors.REQUEST_NOT_FOUND);
    }

    // request exist but not pending
    throw new AppError(RequestErrors.REQUEST_NOT_PENDING);

}