import axios from "axios";

const AUDIT_API = process.env.AUDIT_API;

export async function sendAuditLog({ parentId, childId, actionType, description }) {
  try {
    await axios.post(AUDIT_API, {
      parentId,
      childId,
      actionType,
      description
    });
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }
}