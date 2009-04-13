/*
 * Slide 2
 * Based on the original effects.slide code, but with slight modifications
 * to slide so that it uses CSS margin values as opposed to top/left.
 * One caveat is that this doesn't work very well in IE since IE
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
/*global jQuery, _createWrapper */
$.effects.slide2 = function(o) {
	o.options = $.extend({
		mode: 'show',
		easing: 'swing',
		direction: 'left'
	}, o.options || {});
	
	return this.queue(function() {
		var el = $(this),
				props = ['position','marginTop','marginLeft','marginRight'],
		    mode = $.effects.setMode(el, o.options.mode),
        direction = o.options.direction || 'up',
				vAttr = 'marginTop',
				hAttr = direction == 'right' ? 'marginRight' : 'marginLeft',
        ref = (direction == 'up' || direction == 'down') ? vAttr : hAttr,
				motion = (direction == 'up' || direction == 'left' || direction == 'right') ? 'pos' : 'neg',
        distance = o.options.distance,
        animation = {};

		$.effects.save(el, props); el.show(); // save props and show
		// important to get distance after el.show(), otherwise we get wrong values
		distance = distance || (ref == vAttr ? el.outerHeight() : el.outerWidth());
		
		// if about to show, then shift the contents first
		if(mode == 'show') { el.css(ref, -distance); }
		
		_createWrapper(el).css({overflow:'hidden'}); // Create Wrapper

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

function _createWrapper(element) {
	//if the element is already wrapped, return it
	if (element.parent().is('.ui-effects-wrapper')) {
		return element.parent();
	}

	element.wrap('<div class="ui-effects-wrapper" style="font-size:100%;background:transparent;border:none;margin:0;padding:0"></div>');
	return element.parent();
}

})(jQuery);
