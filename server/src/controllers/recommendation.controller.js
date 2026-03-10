import { getParentRecommendations } from "../services/recommendation.service.js";

export async function getParentRecommendationsController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { childId } = req.params;

    const data = await getParentRecommendations(parentId, childId);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}