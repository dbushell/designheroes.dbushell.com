function acontains(arr, o) { var i = arr.length; while (i--) { if (arr[i] == o) { return true; }} return false; }
(function($) {
    $.fn.tipsy = function(options) {

        options = $.extend({}, $.fn.tipsy.defaults, options);
        
        return this.each(function() {
            
            var opts = $.fn.tipsy.elementOptions(this, options);
            
            $(this).hover(function() {

                $.data(this, 'cancel.tipsy', true);

                var tip = $.data(this, 'active.tipsy');
                if (!tip) {
                    tip = $('<div class="tipsy"><div class="tipsy-inner"/></div>');
                    tip.css({position: 'absolute', zIndex: 100000});
                    $.data(this, 'active.tipsy', tip);
                }

                if ($(this).attr('title') || typeof($(this).attr('original-title')) != 'string') {
                    $(this).attr('original-title', $(this).attr('title') || '').removeAttr('title');
                }

                var title;
                if (typeof opts.title == 'string') {
                    title = $(this).attr(opts.title == 'title' ? 'original-title' : opts.title);
                } else if (typeof opts.title == 'function') {
                    title = opts.title.call(this);
                }

                tip.find('.tipsy-inner')[opts.html ? 'html' : 'text'](title || opts.fallback);

                var pos = $.extend({}, $(this).offset(), {width: this.offsetWidth, height: this.offsetHeight});
                tip.get(0).className = 'tipsy'; // reset classname in case of dynamic gravity
                tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).appendTo(document.body);
                var actualWidth = tip[0].offsetWidth, actualHeight = tip[0].offsetHeight;
                var gravity = (typeof opts.gravity == 'function') ? opts.gravity.call(this) : opts.gravity;

                switch (gravity.charAt(0)) {
                    case 'n':
                        tip.css({top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}).addClass('tipsy-north');
                        break;
                    case 's':
                        tip.css({top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}).addClass('tipsy-south');
                        break;
                    case 'e':
                        tip.css({top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}).addClass('tipsy-east');
                        break;
                    case 'w':
                        tip.css({top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}).addClass('tipsy-west');
                        break;
                }
                if (opts.fade) {
                    tip.css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: 0.8}, 100);
                } else {
                    tip.css({visibility: 'visible'});
                }
            }, function() {
                $.data(this, 'cancel.tipsy', false);
                var self = this;
                setTimeout(function() {
                    if ($.data(this, 'cancel.tipsy')) return;
                    var tip = $.data(self, 'active.tipsy');
                    if (opts.fade) {
                        tip.stop().fadeOut(50, function() { $(this).remove(); });
                    } else {
                        tip.remove();
                    }
                }, 100);
            }); 
        });  
    };
    $.fn.tipsy.elementOptions = function(ele, options) {
        return $.metadata ? $.extend({}, options, $(ele).metadata()) : options;
    };
    $.fn.tipsy.defaults = {
        fade: false,
        fallback: '',
        gravity: 'n',
        html: false,
        title: 'title'
    };
    $.fn.tipsy.autoNS = function() {
        return $(this).offset().top > ($(document).scrollTop() + $(window).height() / 2) ? 's' : 'n';
    };
    $.fn.tipsy.autoWE = function() {
        return $(this).offset().left > ($(document).scrollLeft() + $(window).width() / 2) ? 'e' : 'w';
    };
})(jQuery);

/*
 *
 * Design Heroes
 * Copyright 2010, David Bushell
 *
 */

$(document).ready(function()
{	
	if (!document.getElementById('bookmarks')) { return; }
	
	var previewSpeed = 200;
	var showSpeed = 150;
	var overlaySpeed = 500;
	var tagsSpeed = 300;

	var articles = new Array();
	var current = null;
	var delay = null;
	
	$tags = $('#tags');
	
	showTags = function(articleId) {
		if (!singleBookmark) {
			for (var id in tagHandles) {
				if (!id) continue;
				if (articleId) {
					if (acontains(bookmarkTags[articleId], id)) {
						tagHandles[id].removeClass('fade');
					} else {
						tagHandles[id].addClass('fade');
					}
				} else {
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
		if (!$tags.hasClass('toggled')) {
			$tags.removeClass('visible');
			$tags.stop(true, true).fadeOut(tagsSpeed);
		} else if (!singleBookmark) {
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
	
	if (singleBookmark) {
		var commentCaptcha = false;
		var commentCaptchaFocus = true;
		var commentCaptchaReady = false;
		recaptchaCallback = function() {
			commentCaptchaReady = true;
			if (commentCaptchaFocus) {
				Recaptcha.focus_response_field();
			}
		};
		showCaptcha = function() {
			commentCaptcha = true;
			Recaptcha.create(reCaptchaPublicKey,
				"comments-form-captcha", {
				theme: "white",
		   	callback: recaptchaCallback
		   });
		};
		$('#comments-form-submit', '#comments-form').click(function() {
			if (!commentCaptcha) {
				showCaptcha();
			   return false;
			}
			return commentCaptchaReady;
		});
		$('#comments-form-comment', '#comments-form').keypress(function() {
			if (!commentCaptcha) {
				commentCaptchaFocus = false;
				showCaptcha(false);
			} else {
				$(this).unbind();
			}
		});
	}
	
	showArticle = function(article)
	{
		if (!article.hasClass('closed')) return;
		article.addClass('transition');	
		article.animate({ height: '+=260' }, showSpeed, 'linear', function()
		{
			article.removeClass('closed').removeClass('preview').removeClass('transition').addClass('open');
			delay = setTimeout(function() {
				if(!article.hasClass('hover')) {
					hideOverlay(article);
				}
			}, overlaySpeed);
		});
		$('.dhd:first p', article).fadeIn(showSpeed);
		$('.photo:first', article).animate({ top: '+=130' }, showSpeed);
		$('.photo:first', article).fadeTo(showSpeed, 1);
		var overlay = $('div.dho:first', article);
		$('.tags:first', overlay).stop(true, true).fadeIn(showSpeed);
		$('.date:first', overlay).stop(true, true).fadeIn(previewSpeed);
		$('.dhe:first', overlay).stop(true, true).fadeIn(showSpeed);
		hideTags();
		current = article;
	};
	
	hideArticle = function(article) {
		if (!article.hasClass('open')) return;
		clearTimeout(delay);
		article.addClass('transition');
		article.removeClass('open');
		article.animate({ height: '-=260' }, showSpeed, 'linear', function()
		{
			article.addClass('closed').removeClass('transition');
			if (article.hasClass('hover')) {
				showPreview(article);
			};
		});
		$('.dhd:first p', article).fadeOut(showSpeed);
		$('.photo:first', article).animate({ top: '-=130' }, showSpeed);
		$('.photo:first', article).fadeTo(showSpeed, .3);
		var overlay = $('div.dho:first', article);
		$('.tags:first', overlay).stop(true, true).fadeOut(showSpeed);
		$('.date:first', overlay).stop(true, true).fadeOut(previewSpeed);
		$('.dhe:first', overlay).stop(true, true).fadeOut(showSpeed);
	};
	
	showOverlay = function(article) {
		if (article.hasClass('transition')) return;
		if (!article.hasClass('open')) return;
		var overlay = $('div.dho:first', article);
		$('.tags:first', overlay).stop(true, true).fadeIn(overlaySpeed);
		$('.date:first', overlay).stop(true, true).fadeIn(overlaySpeed);
		$('.dhe:first', overlay).stop(true, true).fadeIn(overlaySpeed);
	};
	
	hideOverlay = function(article, force) {
		if (article.hasClass('transition')) return;
		if (!force && !article.hasClass('open')) return;
		var overlay = $('div.dho:first', article);
		$('.tags:first', overlay).stop(true, true).fadeOut(overlaySpeed);
		$('.date:first', overlay).stop(true, true).fadeOut(overlaySpeed);
		$('.dhe:first', overlay).stop(true, true).fadeOut(overlaySpeed);
	};
	
	showPreview = function(article) {
		if (article.hasClass('transition')) return;
		if (!article.hasClass('closed')) return;
		article.addClass('preview');
		$('.photo:first', article).stop(true, true).fadeTo(previewSpeed, 1);
		$('div.dho:first .date:first', article).stop(true, true).fadeIn(previewSpeed);
		$('.dhd:first .title:first', article).stop(true, true).fadeIn(previewSpeed);
	};
	
	hidePreview = function(article) {
		if (article.hasClass('transition')) return;
		if (!article.hasClass('closed')) return;
		article.removeClass('preview');
		$('.photo:first', article).stop(true, true).fadeTo(previewSpeed, .3);
		$('div.dho:first .date:first', article).stop(true, true).fadeOut(previewSpeed);
		$('.dhd:first .title:first', article).stop(true, true).fadeOut(previewSpeed);
	};
	
	var count = 0;
	
	$('article', '#bookmarks').each(function()
	{
		var bookmark = $(this);
		var id = bookmark.attr('id');
		articles.push(id);
		count++;
		if (!current) current = bookmark;
		
		bookmark.click(function(e) {
			if (bookmark.hasClass('closed') && !bookmark.hasClass('transition')) {
				hideArticle(current);
				showArticle($(this));
			} else if (bookmark.hasClass('open') && $(e.target).hasClass('photo')) {
				var bl = $('a.url:first', current);
				if (!singleBookmark || !bl.hasClass('internal')) {
					if (bl.hasClass('internal')) {
						document.location.href = bl.attr('href');
					} else {
						window.open(bl.attr('href'));
					}
				}
			}
		});

		
		$('div.dho:first ul.tags:first a', bookmark).mouseenter(function(){
			if (singleBookmark) {
				showTags();
			} else {
				//if (!a.transition) {
					showTags(id);
				//}
			}	
		});
			
		$('div.dho:first ul.tags:first a', bookmark).mouseleave(function(){
			if (singleBookmark) {
				hideTags();
			} else {
				hideTags(id);		
			}
		});
		
		$('div.dho:first ul.tags:first a', bookmark).click(function() {
			if (!singleBookmark) {
				if (!$tags.hasClass('toggled')) {
					$tags.addClass('toggled');
					showTags(id);
				}
			}
		});

		$('div.dhe:first .shorturl:first', bookmark).click(function() {
			$field = $('.dhe:first .shorturl-field:first', $('article#'+id));
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

		bookmark.mouseenter(function() {
			bookmark.addClass('hover');
			if (bookmark.hasClass('open')) {
				showOverlay(bookmark);
			} else if (bookmark.hasClass('closed')) {
				showPreview(bookmark);
			}
		});
		
		bookmark.mouseleave(function() {
			bookmark.removeClass('hover');
			if (bookmark.hasClass('open')) {
				hideOverlay(bookmark, true);
			} else if (bookmark.hasClass('closed')) {
				hidePreview(bookmark);
			}
		});

	});
	
	if (!singleBookmark) {
		
		$(document).keydown(function(e) {
			if (current.hasClass('transition')) return;
			if (e.keyCode == 38) {
				if (current.prev('article').hasClass('closed')) {
					hideArticle(current);
					current = current.prev('article');
					showArticle(current);
				}
				return false;
			} else if (e.keyCode == 40) {
				if (current.next('article').hasClass('closed')) {
					hideArticle(current);
					current = current.next('article');
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
	
	$('a.tip', '#bookmarks').tipsy({ gravity: 's', fade: true });

});