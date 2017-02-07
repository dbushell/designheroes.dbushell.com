function acontains(arr, o) { var i = arr.length; while (i--) { if (arr[i] == o) { return true; }} return false; }
$(document).ready(function()
{
	if (!document.getElementById('bookmarks')) return;
	
	var previewSpeed = 200;
	var showSpeed = 150;
	var overlaySpeed = 500;
	var tagsSpeed = 300;

	var articles = new Array();
	var current = null;
	var delay = null;
	
	$tags = $('#tags');
	
	//var moveDown = false;
	
	showTags = function(articleId) {
		if (!singleBookmark) {
			for (var id in tagHandles) {
				if (!id) continue;
				if (articleId) {
					// set tags to bookmark filter
					if (acontains(bookmarkTags[articleId], id)) {
						tagHandles[id].removeClass('fade');
					} else {
						tagHandles[id].addClass('fade');
					}
				} else {
					// set tags to current filter
					if (currentTags.length == 0 || acontains(currentTags, id)) {
						tagHandles[id].removeClass('fade');
					} else {
						tagHandles[id].addClass('fade');
					}
				}
			}
		}
		if (!$tags.hasClass('visible')) {
			$tags.addClass('visible');
			$tags.stop(true, true).fadeTo(tagsSpeed, 1);
		}
		if ($tags.hasClass('toggled')) {
			$('#nav-tags').parent().addClass('selected');
		}
	};
	
	hideTags = function() {
		// hide all tags if the toggle isnt switched on
		if (!$tags.hasClass('toggled')) {
			$tags.removeClass('visible');
			$tags.stop(true, true).fadeOut(tagsSpeed);
		} else if (!singleBookmark) {
			// only reset tags to default filter if we're not fading out
			for (var id in tagHandles) {
				if (!id) continue;
				if (currentTags.length == 0 || acontains(currentTags, id)) {
					tagHandles[id].removeClass('fade');
				} else {
					tagHandles[id].addClass('fade');
				}
			}
		} else if (singleBookmark) {
			$tags.removeClass('visible');
			$tags.stop(true, true).fadeOut(tagsSpeed);
		}
	};
	
	toggleTags = function() {
		if (!$tags.addClass('visible')) {
			$tags.addClass('toggled');
			$('#nav-tags').parent().addClass('selected');
			showTags();
		} else {
			$tags.removeClass('toggled');
			$('#nav-tags').parent().removeClass('selected');
			hideTags();
		}
	};

	if (!singleBookmark) {
		// show tags on page load?	
		if ($tags.hasClass('toggled')) {
			$tags.addClass('visible');
			$tags.show();
		}
		$('#nav-tags').live('click', function() {
			if ($tags.hasClass('visible')) {
				$tags.removeClass('toggled');
				hideTags();
				$(this).parent().removeClass('selected');
			} else {
				$tags.addClass('toggled');
				showTags();
			}
			return false;
		});
		$('#hide-tags', $tags).click(function() {
			toggleTags();
		});
	}
	
	showArticle = function(article) {
		if (article.transition) return;
		if (!article.$.hasClass('closed')) return;
		article.transition = true;
		article.$.animate({ height: '+=260' }, showSpeed, 'linear', function() {
			article.$.removeClass('closed').removeClass('preview').addClass('open');
			article.transition = false;
			delay = setTimeout(function() {
				if(!article.$.hasClass('hover')) {
					hideOverlay(article);
				}/*
				if (moveDown && ($(document).height() - $(window).height()) - $(document).scrollTop() > 300) {
					$.scrollTo(article.$, 500, { axis:'y', offset: {top: -220, left: 0} });
				}*/
			}, overlaySpeed);
			console.log($(document).height());
		});
		//article.showcase.animate({ height: '+=260' }, showSpeed);
		article.description.children('p').fadeIn(showSpeed);
		article.photo.animate({ top: '+=130' }, showSpeed);
		article.photo.fadeTo(showSpeed, 1);
		article.overlay.children('.tags').fadeIn(showSpeed);
		article.overlay.children('.date').fadeIn(showSpeed);
		article.overlay.children('.extras').fadeIn(showSpeed);
		hideTags();
		current = article;
		
	};
	
	hideArticle = function(article) {
		if (article.transition) return;
		if (!article.$.hasClass('open')) return;
		clearTimeout(delay);
		article.transition = true;
		article.$.removeClass('open');
		article.$.animate({ height: '-=260' }, showSpeed, 'linear', function() {
			article.$.addClass('closed');
			article.transition = false;
			if (article.$.hasClass('hover')) {
				showPreview(article);
			};
		});
		//article.showcase.animate({ height: '-=260' }, showSpeed);
		article.description.children('p').fadeOut(showSpeed);
		article.photo.animate({ top: '-=130' }, showSpeed);
		article.photo.fadeTo(showSpeed, .3);
		article.overlay.children('.date').fadeOut(previewSpeed);
		article.overlay.children('.extras').fadeOut(showSpeed);
		article.overlay.children('.tags').stop(true, true).fadeOut(showSpeed);
		article.overlay.children('.extras').stop(true, true).fadeOut(showSpeed);
	};
	
	showOverlay = function(article) {
		if (article.transition) return;
		if (!article.$.hasClass('open')) return;
		article.overlay.children('.tags').stop(true, true).fadeIn(overlaySpeed);
		article.overlay.children('.date').stop(true, true).fadeIn(overlaySpeed);
		article.overlay.children('.extras').stop(true, true).fadeIn(overlaySpeed);
	};
	
	hideOverlay = function(article, force) {
		if (!force && article.transition) return;
		if (!force && !article.$.hasClass('open')) return;
		article.overlay.children('.tags').stop(true, true).fadeOut(overlaySpeed);
		article.overlay.children('.date').stop(true, true).fadeOut(overlaySpeed);
		article.overlay.children('.extras').stop(true, true).fadeOut(overlaySpeed);
	};
	
	showPreview = function(article) {
		if (article.transition) return;
		if (!article.$.hasClass('closed')) return;
		article.$.addClass('preview');
		article.photo.stop(true, true).fadeTo(previewSpeed, 1);
		article.overlay.children('.date').stop(true, true).fadeIn(previewSpeed);
		article.description.children('.title').stop(true, true).fadeIn(previewSpeed);
	};
	
	hidePreview = function(article) {
		if (article.transition) return;
		if (!article.$.hasClass('closed')) return;
		article.$.removeClass('preview');
		article.photo.stop(true, true).fadeTo(previewSpeed, .3);
		article.overlay.children('.date').stop(true, true).fadeOut(previewSpeed);
		article.description.children('.title').stop(true, true).fadeOut(previewSpeed);
	};

	if (!singleBookmark) {
		$(document).keydown(function(e) {
			if (e.keyCode == 38) {
				if (!current.transition && current.index > 0) {
					hideArticle(current);
					current = articles[(current.index - 1)];
					showArticle(current);
				}
				return false;
			} else if (e.keyCode == 40) {
				if (!current.transition && current.index < (articles.length - 1)) {
					hideArticle(current);
					current = articles[(current.index + 1)];
					showArticle(current);
				}
				return false;
			}
		});
		$(window).scroll(function() {
			var p = $(document).scrollTop();
			if (p > 190) {
				$tags.css('paddingTop', (p-190) + 'px');
			} else {
				$tags.css('paddingTop', '0');
			}
		});
	}
	
	var count = 0;
	
	$('#bookmarks article').each(function()
	{
		
		var id = $(this).attr('id');
		var i = parseInt(id.substr(4, id.length - 4));
		articles.push({ $: $(this), index: count, uid: i, id: 'dha-' + i, transition: false, description: $('#dhd-' + i), showcase: $('#dhs-' + i), overlay: $('#dho-' + i), photo: $('#dhp-' + i) });
		var a = articles[articles.length - 1];
		count++;
		if (!current) current = a;
		/*
		a.$.mouseenter(function() {
			a.$.addClass('hover');
			if (a.$.hasClass('open')) {
				showOverlay(a);
			} else if (a.$.hasClass('closed')) {
				showPreview(a);
			}
		});

		a.$.mouseleave(function() {
			a.$.removeClass('hover');
			if (a.$.hasClass('open')) {
				hideOverlay(a);
			} else if (a.$.hasClass('closed')) {
				if (a.transition) {
					hideOverlay(a, true);
				} else {
					hidePreview(a);
				}
			}
		});
		*/
		a.$.click(function() {
			if (a.$.hasClass('closed')) {
				hideArticle(current);
				showArticle(a);
			} else if (a.$.hasClass('open')) {
				//hideArticle(a);
			}
		});
		
		$('ul.tags:first a', a.overlay).mouseenter(function(){
			if (singleBookmark) {
				showTags();
			} else {
				if (!a.transition) {
					showTags(a.id);
				}
			}	
		});

			
		$('ul.tags:first a', a.overlay).mouseleave(function(){
			if (singleBookmark) {
				hideTags();
			} else {
				hideTags(a.id);		
			}
		});
		
		$('ul.tags:first a', a.overlay).click(function() {
			if (!a.transition && !singleBookmark) {
				if (!$tags.hasClass('toggled')) {
					$tags.addClass('toggled');
					showTags(a.id);
				}
			}
		});

		$('.extras:first .shorturl:first', this).click(function() {
			$field = $('.extras:first .shorturl-field:first', a.$);
			if ($field.hasClass('visible')) {
				$field.removeClass('visible');
				$field.stop(true).fadeOut(150);
			} else {
				$field.addClass('visible');
				$field.stop(true).fadeIn(150);
				$field.select();
			}
			return false;
		});
		
	});
	
	$('#bookmarks article').mouseenter(function() {
		$(this).addClass('hover');
		var id = $(this).attr('id');
		var index = parseInt(id.substr(4, id.length - 4));
		console.log(id);
		if ($(this).hasClass('open')) {
			showOverlay(articles[index]);
		} else if ($(this).hasClass('closed')) {
			showPreview(articles[index]);
		}
	});
	
	$('#bookmarks article').mouseleave(function() {
		$(this).removeClass('hover');
		var id = $(this).attr('id');
		var index = parseInt(id.substr(4, id.length - 4));
		if ($(this).hasClass('open')) {
			showOverlay(articles[index], true);
		} else if ($(this).hasClass('closed')) {
			showPreview(articles[index]);
		}
	});

});