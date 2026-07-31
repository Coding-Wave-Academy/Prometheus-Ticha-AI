import { getSubjectsByLevel } from '../services/subjectService.js';
import { successResponse } from '../utils/response.js';

export async function listSubjects(req, res, next) {
  try {
    const levelCodeOrId = req.query.level || req.validated_query?.level;
    const subjects = await getSubjectsByLevel(levelCodeOrId);
    return successResponse(res, subjects);
  } catch (err) {
    next(err);
  }
}
