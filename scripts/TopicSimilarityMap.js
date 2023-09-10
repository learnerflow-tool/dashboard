function TopicSimilarityMap() {
	//this.map = new Object();
	this.links = [];
	this.nodes = [];
}

TopicSimilarityMap.prototype.wrap = function(tsm) {
	this.links = tsm.links;
	this.nodes = tsm.nodes;
}

function AddOnDataMap() {
	this.map = new Object();
	//this.data = [];
}

AddOnDataMap.prototype.wrap = function(tsm) {
	this.data = tsm.data;
}