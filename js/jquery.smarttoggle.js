/*
 * Smart Toggle 1.0
 * (c) Copyright 2009 Ramin. All Rights Reserved.
 * http://www.getintothis.com
 *
 * Depends:
 *  jquery-1.3.2.js
 *  effects.core.js
 *  effects.core.ext.js
 */
(function($) {
/*global jQuery, document, handleBlur */

var smarttoggleCount = 0;

$.fn.smarttoggle = function() {
	var args = arguments,
			self = this;
			
	return this.each(function() {
		var me = $(this),
				toggler = $('.ui-toggle', this),
				content = $('.ui-content', this),
				options = $.extend({
					toggler: toggler,
					content: content,
					eventType: 'click',
					hideDelay: 500,
					contentHidden: true,
					blur: true,
					mode: 'toggle',
					easing: 'easeOutBounce',
					direction: 'up',
				  duration: 750
				}, args[1] || {}),
				normalizedArgs = self._normalizeArguments(args, options),
				effect = normalizedArgs[0],
				effectOpts = normalizedArgs[1],
				effectDur = normalizedArgs[2],
				effectCallback = normalizedArgs[3],
				leftRightMode = options.direction == 'left' || options.direction == 'right';

		// it helps to implicitly set the width when direction = 'left' or 'right'
		// and we are floating things. for example for menus
		if(leftRightMode) { content.width(content.outerWidth()); }
		if(options.contentHidden) { content.hide(); }
		
		// special handling of 'hover'
		if(options.eventType === 'hover') {
			me.bind('mouseenter.smarttoggle', function() {
				if(me.hideTimeout) { window.clearTimeout(me.hideTimeout); }
				effectOpts.mode = 'show';
				if(!content._isOpen()) { content.effect.call(content, effect, effectOpts, effectDur, effectCallback); }
			});
			me.bind('mouseleave.smarttoggle', function() {
				effectOpts.mode = 'hide';				 
				me.hideTimeout = window.setTimeout(function() {
					if(content._isOpen()) { content.effect.call(content, effect, effectOpts, effectDur, effectCallback); }
				}, options.hideDelay);
			});
		}
				
		if(options.blur) {
			me.data('smarttoggleCount', smarttoggleCount++);
			handleBlur(me, options, normalizedArgs);
		}
		
		toggler.bind('click.smarttoggle', function() {
			content.toggle.call(content, effect, effectOpts, effectDur, effectCallback);
		})._disableSelection();
	});
};

function handleBlur(me, options, args) {
	var content = options.content,
			count = me.data('smarttoggleCount');
			
	$(document).bind('click.smarttoggle-' + count, function(e) {
		if(content._isOpen() && 
				!(options.toggler[0] == e.target ||
					content[0] == e.target ||
					$.inArray(content[0], $.makeArray($(e.target).parents())) != -1)) {
			args[1] = $.extend({ mode: 'hide' }, args[1]); // set the mode to 'hide'
			content.effect.apply(content, args);
		}
		return false;
  });
}

})(jQuery);