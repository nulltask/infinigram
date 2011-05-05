(function($) {

function showLoadingIndicator() {
	$(".loading").fadeIn(250);
}
function hideLoadingIndicator() {
	$(".loading").fadeOut(1250);
}
function resetContainer() {
	if ($(".container").length > 0) {
		$(".container").remove();
	}
	$("#contentBox").append($("<div></div>").addClass("container"));
}
function setupContainer() {
	$.autopager({
		content: ".container",
		link: "a[rel=older]",
		start: function(current, next) {
			showLoadingIndicator();
		},
		load: function(current, next) {
			onComplete();
		}
	});
}
function onComplete() {
	$(".images:last").isotope({
		itemSelector: ".box"
	});
	if ($(window).height() > $(document).height()) {
		$.autopager('load');
	}
	hideLoadingIndicator();
}

$(".searchBox").live("submit", function(event) {
	var tag = $(this).find("[type=search]").val().replace(/\s/g, "_");
	var jqxhr = $.ajax({
		url: "/tags/" + tag + ".html",
		type: "GET",
		dataType: "html",
		beforeSend: function() {
			resetContainer();	
			showLoadingIndicator();
		},
		success: function(data) {
			var $data = $(data);
			var $appendItem = $data.find(".container").children();
			console.log($appendItem);
			$(".container").append($appendItem);
			setupContainer();
		},
		complete: function() {
			onComplete();
		}
	});
	return false;
});

$(function() {
	$(window).resize(function() {
			$(".container").width($(window).width());
	});
	$("input[type=search]:first").focus();
//	$(".loading").touchScroll();
});

})(jQuery);
