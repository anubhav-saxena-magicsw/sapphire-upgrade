// titleupdater.js - Change favicon and title of html page dynamically.
// Copyright (c) 2014 Magic Software Pvt. Ltd.

// USAGE:
// * titleUpdater.changeFavicon("newFavIcon path");  (Optional 2nd arg is new title.)
// * titleUpdater.changeTitle("New title text");

	var titleUpdater = {

		// -- "PUBLIC" ----------------------------------------------------------------

		changeFavicon : function(iconURL, optionalMPlayerTitle) {"use strict";
			if (optionalMPlayerTitle) {
				document.title = optionalMPlayerTitle;
			}
			this.addLink(iconURL, true);
		},
		
		changeTitle : function(mPlayerTitle){"use strict";
			document.title = mPlayerTitle;
		},

		addLink : function(iconURL) {"use strict";
			var link = document.createElement("link");
			link.type = "image/x-icon";
			link.rel = "shortcut icon";
			link.href = iconURL;
			this.removeLinkIfExists();
			this.mPlayerHead.appendChild(link);
		},

		removeLinkIfExists : function() {"use strict";
			var links, link, i;
			links = this.mPlayerHead.getElementsByTagName("link");
			for ( i = 0; i < links.length; i += 1) {
				link = links[i];
				if (link.type === "image/x-icon" && link.rel === "shortcut icon") {
					this.mPlayerHead.removeChild(link);
					return;
					// Assuming only one match at most.
				}
			}
		},

		mPlayerHead : document.getElementsByTagName("head")[0]
	};