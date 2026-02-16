const { createError } = require("../configs/errorConfig");
const { analysisService } = require("../services");

const getCompleteAnalysisData = async (req, res, next) => {
  let branches_id = [];
  const business_id = req.user.business_id
  try {
    const { branchId, dateFilter, customStart, customEnd } = req.query;
    if (!branchId ) {
      branches_id = req.user.branches.map((item) => item.branch_id);
    } else {
      branches_id.push(...branchId.split(","));
    }
    
    const data = await analysisService.getCompleteAnalysisData(
      branches_id,
      dateFilter || "thisWeek",
      customStart,
      customEnd,
      business_id
    );
    res.status(200).json({ status: 200, data });
  } catch (error) {
    return next(createError(error.status || 500, error.message));
  }
};

module.exports = {
  getCompleteAnalysisData,
};
