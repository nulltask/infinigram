(function($) {

function resetContainer() {
	if ($(".container").length > 0) {
		$(".container").remove();
	}
	$("#contentBox").append($("<div></div>").addClass("container"));
}
function setupContainer() {
	$(".container").masonry({
		columnWidth: 100,
		itemSelector: ".box:visible",
		resizeable: true,
		animate: true
	});
	$(".container").infinitescroll({
		navSelector: ".nav",
		nextSelector: ".nav a[rel=older]",
		itemSelector: ".box",
		donetext: "no more image to load.",
		debug: true,
		errorCallback: function() {

		},
	},
	function(elem) {
		console.log(elem);
		setTimeout(function() {
			$(".container").masonry({ appendedContent: $(elem) });
		}, 1000);
	})
}

$(".searchBox").live("submit", function(event) {
	var tag = $(this).find("[type=search]").val().replace(/\s/g, "_");
	var jqxhr = $.ajax({
		url: "/tags/" + tag + ".html",
		type: "GET",
		dataType: "html",
		beforeSend: function() {
			resetContainer();	
		},
		success: function(data) {
			var $data = $(data);
			var $appendItem = $data.find(".container").children();
			console.log($appendItem);
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
