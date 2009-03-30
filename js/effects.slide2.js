/*
 * Slide 2
 * Based on the original effects.slide code, but with slight modifications
 * to slide in the given element using CSS margin values as opposed to top/left.
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
	return this.queue(function() {
		var el = $(this),
				props = ['position','top','left','width','height'],
		    mode = $.effects.setMode(el, o.options.mode || 'show'),
        direction = o.options.direction || 'left',
        ref = (direction == 'up' || direction == 'down') ? 'marginTop' : 'marginLeft',
				motion = (direction == 'up' || direction == 'left') ? 'pos' : 'neg',
        distance = o.options.distance || (ref == 'marginTop' ? el.outerHeight() : el.outerWidth()),
        animation = {};

		$.effects.save(el, props);
		el.show();

		animation[ref] = (mode == 'show' ? (motion == 'pos' ? '+=' : '-=') : (motion == 'pos' ? '-=' : '+=')) + distance;
		el.animate(animation, { queue: false, duration: o.duration, easing: o.options.easing, complete: function() {
			if(mode == 'hide') { el.hide(); }
			if(o.callback) { o.callback.apply(this, arguments); }
			el.dequeue();
		}});
	});
};

})(jQuery);
