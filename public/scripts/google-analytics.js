(function () {
	if (!window.gaMeasurementId || window.__gaInitialized) {
		return;
	}

	window.dataLayer = window.dataLayer || [];
	window.gtag =
		window.gtag ||
		function () {
			window.dataLayer.push(arguments);
		};

	window.gtag("js", new Date());
	window.gtag("config", window.gaMeasurementId, {
		anonymize_ip: true,
		send_page_view: false,
	});

	window.__gaTrackPageView = function () {
		window.gtag("event", "page_view", {
			page_location: window.location.href,
			page_path: window.location.pathname + window.location.search,
			page_title: document.title,
		});
	};

	document.addEventListener("astro:page-load", window.__gaTrackPageView);
	window.__gaInitialized = true;
})();
