const { getActiveCredentialCount } = require("../services/credential");
const { getRiskAlerts } = require("../services/dashboard");
const { getOpenDisputes, getDisputeActivity } = require("../services/dispute");
const { getUserCount, getUserGrowth, getRoleBreakdown } = require("../services/users");

exports.getDashboardLog =  async (req, res)=>{
    try {
        if (!req.user?.id) {
            return res.status(401).json({
            success: false,
            message: "Unauthorized",
            });
        }

        const [
            userCount,
            disputeOpenCount,
            activeCredentialCount,
            disputeActivity,
            userGrowth,
            roleBreakdown,
            riskAlerts
        ] = await Promise.all([
            getUserCount(),
            getOpenDisputes(),
            getActiveCredentialCount(),
            getDisputeActivity(),
            getUserGrowth(),
            getRoleBreakdown(),
            getRiskAlerts(),
        ]);

        return res.status(200).json({
            success: true,
            data: {
            totalUsers: userCount.length || 0,
            openDisputes: disputeOpenCount.length || 0,
            activeCredentials: activeCredentialCount.length || 0,
            disputeActivity: disputeActivity || [],
            userGrowth: userGrowth || [],
            roleBreakdown: roleBreakdown || [],
            riskAlerts: riskAlerts || {},
            },
        });
        } catch (error) {
        console.error("Dashboard Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data",
            error: error.message,
        });
    }
}