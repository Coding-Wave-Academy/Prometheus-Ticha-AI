import { getPapers, getPaperById, incrementDownloadAndGetSignedUrl } from '../services/paperService.js';
import { successResponse, paginatedResponse, errorResponse } from '../utils/response.js';

export async function listPapers(req, res, next) {
  try {
    const params = req.validated_query || req.query;
    const result = await getPapers(params);

    return paginatedResponse(res, result.papers, {
      page: result.page,
      limit: result.limit,
      total: result.total,
    });
  } catch (err) {
    next(err);
  }
}

export async function getPaperDetails(req, res, next) {
  try {
    const { id } = req.params;
    const paper = await getPaperById(id);

    if (!paper) {
      return errorResponse(res, `Paper with ID '${id}' not found`, 404, 'NOT_FOUND');
    }

    return successResponse(res, paper);
  } catch (err) {
    next(err);
  }
}

export async function downloadPaper(req, res, next) {
  try {
    const { id } = req.params;
    const shouldRedirect = req.query.redirect !== 'false';

    const clientInfo = {
      client_id: req.apiClient?.id || null,
      ip_address: req.ip || req.headers['x-forwarded-for'] || null,
      user_agent: req.headers['user-agent'] || null,
    };

    const downloadInfo = await incrementDownloadAndGetSignedUrl(id, clientInfo);

    if (!downloadInfo) {
      return errorResponse(res, `Paper with ID '${id}' not found for download`, 404, 'NOT_FOUND');
    }

    if (shouldRedirect) {
      return res.redirect(302, downloadInfo.download_url);
    }

    return successResponse(res, {
      download_url: downloadInfo.download_url,
      expires_in: downloadInfo.expires_in,
      paper: downloadInfo.paper,
    });
  } catch (err) {
    next(err);
  }
}
