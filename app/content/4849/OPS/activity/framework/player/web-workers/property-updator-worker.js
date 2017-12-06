/*
 * This is a worker file.
 * This is intended to process and help tasks for property updator.
 */

/*
 * Declare and initialize any variables which are going to be processed.
 */
self.members = {
	arrCompToBeCreatedDataQue : [],
	bEmpty : true,
	busy : false
};

self.addEventListener('message', function(e) {
	var action = e.data.action, data = e.data.data, response;
	switch(action) {
	case "addDataInQue":
		self.members.arrCompToBeCreatedDataQue.push(data);
		self.members.bEmpty = false;
		if (self.members.busy === false) {
			response = self.getDataFromQue();
			if (response.data) {
				self.postMessage(response);
			}
		}
		break;
	case "removeDataFromQue":
		self.members.busy = false;
		self.members.arrCompToBeCreatedDataQue.shift();
		if (self.members.arrCompToBeCreatedDataQue.length === 0) {
			self.members.bEmpty = true;
		}
		break;
	case "getNextDataFromQue":
		if (self.members.busy === false) {
			response = self.getDataFromQue();
			if (response.data) {
				self.postMessage(response);
			}
		}
		break;
	}

}, false);

self.getDataFromQue = function() {
	var obj, objTemp;
	obj = {};
	obj.action = "createNewComponent";
	if (self.members.bEmpty === false) {
		self.members.busy = true;
		objTemp = self.members.arrCompToBeCreatedDataQue[0];
		obj.data = JSON.parse(JSON.stringify(objTemp));
	}
	return obj;
};
