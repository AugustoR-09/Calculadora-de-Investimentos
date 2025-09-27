function convertToMonthlyRate(rate) {
	return rate ** (1 / 12);
}

export function generateReturns(
	startingAmount = 0,
	timeHorizon = 0,
	timePeriod = "monthly",
	monthlyContribution = 0,
	returnRate = 0,
	returnTimeFrame = "monthly"
) {
	const finalReturnRate =
		returnTimeFrame === "monthly"
			? 1 + returnRate / 100
			: convertToMonthlyRate(1 + returnRate / 100);

	const finalTimePeriod = timePeriod === "monthly" ? timeHorizon : timeHorizon * 12;

	const referenceInvestment = {
		investedAmount: startingAmount,
		interestReturns: 0,
		totalInterestReturns: 0,
		month: 0,
		totalAmount: startingAmount,
	};

	const returnsArray = [referenceInvestment];

	for (let timeReference = 1; timeReference <= finalTimePeriod; timeReference++) {
		const totalAmount =
			returnsArray[timeReference - 1].totalAmount * finalReturnRate + monthlyContribution;

		const interestReturns = returnsArray[timeReference - 1].totalAmount * (finalReturnRate - 1);

		const investedAmount = startingAmount + monthlyContribution * timeReference;

		const totalInterestReturns = totalAmount - investedAmount;
		returnsArray.push({
			investedAmount,
			interestReturns,
			totalInterestReturns,
			month: timeReference,
			totalAmount,
		});
	}

	return returnsArray;
}
