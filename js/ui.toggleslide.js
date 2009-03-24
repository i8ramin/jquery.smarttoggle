/*
 * SlieMenu 1.0
 *
 * Copyright (c) 2009 Ramin Bozorgzadeh (http://www.getintothis.com)
 *
 * Depends:
 *  jquery-1.3.2.js
 *	ui.core.js
 *  effects.core.js
 */
(function($) {
  
$.effects.slide2 = function(o) {
	return this.queue(function() {

		// Create element
		var el = $(this),
		    mode = $.effects.setMode(el, o.options.mode || 'show'),
        direction = o.options.direction || 'left', // Default Direction
        
        ref = (direction == 'up' || direction == 'down') ? 'marginTop' : 'marginLeft',
        motion = (direction == 'up' || direction == 'left') ? 'pos' : 'neg',
        distance = o.options.distance || (ref == 'marginTop' ? el.outerHeight() : el.outerWidth()),
        animation = {}; // Animation
        
		animation[ref] = (mode == 'show' ? (motion == 'pos' ? '+=' : '-=') : (motion == 'pos' ? '-=' : '+=')) + distance;
		
		// Animate
		el.animate(animation, { queue: false, duration: o.duration, easing: o.options.easing, complete: function() {
			if(o.callback) o.callback.apply(this, arguments); // Callback
			el.dequeue();
		}});
	});
};

var ToggleSlide = {
  _init: function() {
    var self = this,
        options = this.options;

    if(this.options.disabled) {
      this.element.addClass("ui-disabled");
      return false;
    }
        
    this._isBusy = false;
    this._isOpen = options.hideOnLoad;

    this.uiToggle = $(options.toggle, this.element).disableSelection();
    this.uiContent = $(options.content, this.element);

    if(options.hideOnLoad) {
      this._uiClose();
    }
    
    if(options.toggleEvent === 'hover') {
      this.uiToggle.bind('mouseover', function(e, data) {
        self._uiOpen(e, data);
      });
    } else {        
      this.uiToggle.bind(options.toggleEvent, function(e, data) {
          self._isOpen ? self._uiClose(e, data) : self._uiOpen(e, data);
      });
    }
    
    if(options.closeOnLeave || options.toggleEvent === 'hover') {
      this.element.hover(
        function(e, data) {
          self.uiCloseTimeout && clearTimeout(self.uiCloseTimeout);
        },
        function(e, data) {
          self._uiClose(e, data);
        }
      );
    }
    
    this.element.bind('open.toggleslide', function(e, data) {
      self._uiOpen(e, data);
    });
    
    this.element.bind('close.toggleslide', function(e, data) {
      self._uiClose(e, data);
    });
  },
  destroy: function() {
    if(!this.element.data('toggleslide')) return;
		
    this.element
      .removeData("toggleslide")
      .unbind(".toggleslide");
  },
  _uiOpen: function(e, data) {
    var me = this, o = this.options;
    
    if(me._isBusy || me._isOpen || o.disabled) return false;
    
    me._isBusy = true;
    me._trigger('openStart', e, me);

    me.uiOpenTimeout = setTimeout(function() {
      me.uiContent.show(o.effectType, { direction: o.direction, mode: 'show', easing: o.easing }, o.speed, function() {
        me._isOpen = !(me._isBusy = false);
        me._trigger('openStop', e, me);
         
        if(o.closeOnBlur) {
          $(document).bind('click.toggleslide', function(e, data) {
            $(this).unbind('click.toggleslide');
            me._uiClose(e, data);
          });
        }
      });
    }, data || 0);
  },
  _uiClose: function(e, data) {
    var me = this, o = this.options;
    
    me.uiCloseTimeout = setTimeout(function() {
      if(me._isOpen && !me._isBusy) {
        me._isBusy = true;
        me._trigger('closeStart', e, me);
        
        me.uiContent.hide(o.effectType, { direction: o.direction, mode: 'hide', easing: o.easing }, o.speed, function() {
          me._isOpen = me._isBusy = false;
          me._trigger('closeStop', e, me);
        });
      }
    }, data || (e && /click/.test(e.type) ? 0 : o.closeDelay));
  },
  _trigger: function(type, e, ui) {
		return $.widget.prototype._trigger.call(this, type, e, ui);
	},
};


$.widget("ui.toggleslide", ToggleSlide);
$.ui.toggleslide.defaults = {
  wrapper: '.ui-toggleslide',
  content: '.ui-content',
  toggle: '.ui-toggle',
  toggleEvent: 'hover',
  hideOnLoad: true,
  closeOnLeave: true,
  closeOnBlur: false,
  closeDelay: 500,
  direction: 'up',
  easing: 'swing',
  speed: 500,
  effectType: 'slide2'
};

})(jQuery);