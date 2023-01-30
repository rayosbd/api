exports.countDiscount = (sellPrice, percentage) =>
	parseInt((sellPrice * percentage) / 100);

exports.countPrice = (sellPrice, percentage) =>
	sellPrice - this.countDiscount(sellPrice, percentage) > 0
		? sellPrice - this.countDiscount(sellPrice, percentage)
		: 0;
