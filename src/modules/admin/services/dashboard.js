const Credential = require("../../driver/models/credential.model");
const Driver = require("../../driver/models/driver.model");
const PerformanceRecord = require("../../driver/models/performanceRecord.model");

    exports.getRiskAlerts = async () => {
    const alerts = [];
    const today = new Date();

    // ==========================
    // Expired Credentials
    // ==========================

    const expiredCredentials = await Credential.find({
        status: "verified",
        expiryDate: { $lt: today },
        isActive: true,
    })
        .populate("driver")
        .limit(10);

    expiredCredentials.forEach((credential) => {
        alerts.push({
        id: credential._id.toString(),    
        type: "critical",
        category: "compliance",
        title: "Expired Credential",
        message: `${credential.title} has expired`,
        driver:
            `${credential.driver?.firstName || ""} ${credential.driver?.lastName || ""}`.trim(),
        createdAt: credential.expiryDate,
        });
    });

    // ==========================
    // Expiring Within 7 Days
    // ==========================

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const expiringCredentials = await Credential.find({
        status: "verified",
        expiryDate: {
        $gte: today,
        $lte: nextWeek,
        },
        isActive: true,
    })
        .populate("driver")
        .limit(10);

    expiringCredentials.forEach((credential) => {
        alerts.push({
        id: credential._id.toString(),    
        type: "warning",
        category: "credential",
        title: "Credential Expiring Soon",
        message: `${credential.title} expires within 7 days`,
        driver:
            `${credential.driver?.firstName || ""} ${credential.driver?.lastName || ""}`.trim(),
        createdAt: credential.expiryDate,
        });
    });

    // ==========================
    // Driver Score Calculation
    // ==========================

    const scores = await PerformanceRecord.aggregate([
        {
        $match: {
            isActive: true,
            status: "verified",
        },
        },
        {
        $group: {
            _id: "$driver",
            score: {
            $sum: "$impact",
            },
        },
        },
        {
        $match: {
            score: { $lt: -5 }, // adjust threshold
        },
        },
    ]);

    for (const item of scores) {
        const driver = await Driver.findById(item._id);

        alerts.push({
        id:item._id,
        type: "critical",
        category: "safety",
        title: "Driver Score Below Threshold",
        message: `Performance score dropped to ${item.score}`,
        driver:
            `${driver?.firstName || ""} ${driver?.lastName || ""}`.trim(),
        createdAt: new Date(),
        });
    }

    // ==========================
    // Sort Latest First
    // ==========================

    alerts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return {
        alerts,
        criticalCount: alerts.filter((a) => a.type === "critical").length,
        warningCount: alerts.filter((a) => a.type === "warning").length,
    };
    };