import { getAllLevels } from '../services/levelService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export async function listLevels(req, res, next) {
  try {
    const levels = await getAllLevels();
    return successResponse(res, levels);
  } catch (err) {
    next(err);
  }
}
