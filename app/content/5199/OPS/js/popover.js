$(document).ready(function() {
	$('[data-toggle="popover"]').popover();
	$('.PageContainer').off("click").on('click', function(e) {
		
		$('.pop_over').each(function() {
			//the 'is' for buttons that trigger popups
			//the 'has' for icons within a button that triggers a popup
			if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
				$(this).popover('hide');

			}
		});
	});
});
