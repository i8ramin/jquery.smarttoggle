/*
 * Slide 2
 * Based on the original effects.slide code, but with slight modifications
 * to slide so that it uses CSS margin values as opposed to top/left.
 * This version also does not have a "wrapper" so the sliding effect will move the
 * elements below or next to it as it animates, as opposed to "shifting" them and
 * then animating. One caveat is that this doesn't work very well in IE since IE
 * doesn't seem to respect the overflow:hidden rules. If IE is a concern to you,
 * then I recommend sticking with the original effects.slide effect.
 *
 * (c) Copyright 2009 Ramin. All Rights Reserved.
 * http://www.getintothis.com
 *
 * Depends:
 *  effects.core.js
 */
(function($) {

$.effects.slide2 = function(o) {
	o.options = $.extend({
		mode: 'show',
		easing: 'swing',
		direction: 'left'
	}, o.options || {});
	
	return this.queue(function() {
		var el = $(this),
				props = ['position','top','left'],
				vAttr = 'marginTop',
				hAttr = 'marginLeft',
		    mode = $.effects.setMode(el, o.options.mode),
        direction = o.options.direction,
        ref = (direction == 'up' || direction == 'down') ? vAttr : hAttr,
				motion = (direction == 'up' || direction == 'left') ? 'pos' : 'neg',
        distance = o.options.distance || (ref == vAttr ? el.outerHeight() : el.outerWidth()),
				overflowEl = o.options.overflowEl || el.parent(),
        animation = {};

		$.effects._createWrapper(el).css({overflow:'hidden'}); // Create Wrapper
		$.effects.save(el, props);
		el.show();

		animation[ref] = (mode == 'show' ? (motion == 'pos' ? '+=' : '-=') : (motion == 'pos' ? '-=' : '+=')) + distance;
		el.animate(animation, { queue: false, duration: o.duration, easing: o.options.easing, complete: function() {
			if(mode == 'hide') { el.hide(); }
			$.effects.restore(el, props);
			$.effects.removeWrapper(el);
			if(o.callback) { o.callback.apply(this, arguments); }
			el.dequeue();
		}});
	});
};

$.extend($.effects, {
	_createWrapper: function(element) {
		//if the element is already wrapped, return it
		if (element.parent().is('.ui-effects-wrapper'))
			return element.parent();

		//Cache width, height and float properties of the element, and create a wrapper around it
		//var props = { width: element.outerWidth(true), height: element.outerHeight(true), 'float': element.css('float') };
		element.wrap('<div class="ui-effects-wrapper" style="font-size:100%;background:transparent;border:none;margin:0;padding:0"></div>');
		var wrapper = element.parent();

		//Transfer the positioning of the element to the wrapper
		if (element.css('position') == 'static') {
			wrapper.css({ position: 'relative' });
			element.css({ position: 'relative'} );
		} else {
			var top = element.css('top'); if(isNaN(parseInt(top,10))) top = 'auto';
			var left = element.css('left'); if(isNaN(parseInt(left,10))) left = 'auto';
			wrapper.css({ position: element.css('position'), top: top, left: left, zIndex: element.css('z-index') }).show();
			element.css({position: 'relative', top: 0, left: 0 });
		}

		//wrapper.css(props);
		return wrapper;
	}
});

})(jQuery);
