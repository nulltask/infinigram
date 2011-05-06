(function($) {

if (!window.console) {
	window.console = { log: function(){} };
}

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
		itemSelector: ".box",
		layoutMode: "fitRows"
	});
	if ($(window).height() > $(document).height()) {
		$.autopager('load');
	}
	hideLoadingIndicator();
}

$(function() {
	$(".searchBox").bind("submit", function(event) {
		var tag = $(this).find("[type=search]").val().replace(/\s/g, "_");
		window.location.hash = "!/tags/" + tag + "/media/recent";
		return false;
	});
	$("a[href^='/'][href$='.html']").live("click", function(event) {
		window.location.hash = "!" + $(this).attr("href").replace(/\.html$/, "");
		return false;
	});
	$("a[href^='http://']").live("click", function(event) {
		$(this).attr("target", "_blank");
	});
	$("input[type=search]:first").focus();
//	$(".loading").touchScroll();
	$("footer").touchScroll();
	$(window).bind("hashchange", function(event) {
		console.log(event);
		if (event.fragment.length < 1) {
			resetContainer();
			return;
		}

		var keyword = event.fragment.split('/')[2];
		$("input[type=search]").val(keyword);
		var url = event.fragment.replace(/^!/, '') + ".html";
		var jqxhr = $.ajax({
			url: url,
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
	});
	$(window).trigger("hashchange");
});

})(jQuery);
