const summarizeUnpaidMonths = (feeData, classFeeMap) => {
  const summary = {};

  feeData.forEach((item) => {
    const className = item.stdId?.classRef?.name || "UnknownClass";
    const batchName = item.stdId?.batchRef?.name || "UnknownBatch";
    const feeAmount = classFeeMap[className] || 0; // Use from map

    const unpaidCount = Object.values(item.monthlyFees || {}).filter(
      (status) => status === "unpaid"
    ).length;

    const totalUnpaidFee = unpaidCount * feeAmount;

    if (!summary[className]) summary[className] = {};
    if (!summary[className][batchName])
      summary[className][batchName] = { unpaidMonths: 0, totalDue: 0 };

    summary[className][batchName].unpaidMonths += unpaidCount;
    summary[className][batchName].totalDue += totalUnpaidFee;
  });

  return summary;
};

module.exports = summarizeUnpaidMonths;
