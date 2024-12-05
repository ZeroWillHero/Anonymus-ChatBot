const Report = require('../../../models/Report');

const createReport = async (reportedBy, reportedUser, reason) => {
    try {
        const report = new Report({
            reportedBy,
            reportedUser,
            reason
        });
        await report.save();
        return report;
    } catch (error) {
        console.log(error);
    }
}

module.exports = createReport;