(function($) {

function resetContainer() {
	if ($(".container").length > 0) {
		$(".container").remove();
	}
	$("#contentBox").append($("<div></div>").addClass("container"));
}
function setupContainer() {
	$(".container").masonry({
		columnWidth: 106,
		itemSelector: ".box:visible",
		resizeable: true,
		animate: true
	});
	$(".container").infinitescroll({
		navSelector: ".next",
		nextSelector: ".next a",
		itemSelector: ".box",
		donetext: "no more image to load.",
		debug: true,
		errorCallback: function() {

		},
	},
	function(elem) {
		console.log(elem);
		$(".container").masonry({ appendedContent: $(elem) });
	})
}

$(".searchBox").live("submit", function(event) {
	var tag = $(this).find("[type=search]").val();
	var jqxhr = $.ajax({
		url: "/tags/" + tag + ".html",
		type: "GET",
		dataType: "html",
		beforeSend: function() {
			resetContainer();	
		},
		success: function(data) {
			var $data = $(data);
			var $appendItem = $data.children();
			$(".container").append($appendItem);
			setupContainer();
		},
		complete: function() {

		}
	});
	return false;
});

$(function() {
	$(window).resize(function() {
			$(".container").width($(window).width());
	});
});

})(jQuery);
