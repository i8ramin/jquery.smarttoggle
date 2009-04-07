/*
 * ToggleSlide 1.0
 * (c) Copyright 2009 Ramin. All Rights Reserved.
 * http://www.getintothis.com
 *
 * Depends:
 *  jquery-1.3.2.js
 *	ui.core.js
 *  effects.core.js
 */
(function($) {
/*global jQuery, document, setTimeout, clearTimeout */

var SmartToggle = {
  _init: function() {
    var self = this,
				elem = self.element,
        options = this.options,
				toggleHelper = options.toggleHelper,
				vAttr = 'marginTop',
				hAttr = 'marginLeft',
				direction = options.direction || 'up',
				ref = (direction == 'up' || direction == 'down') ? vAttr : hAttr;
    
    self._isBusy = false;
    self._isOpen = options.closeOnLoad || !options.contentHidden;

		if(toggleHelper) {
			toggleHelper.
				css({cursor:'pointer'}).
				disableSelection().
				bind('click', function(e, data) {
					if(self._isOpen) { self._uiClose(e, data); } else { self._uiOpen(e, data); }
				}
			);
	
			if((direction == 'left' || direction == 'right') && options.adjustToggleHeight) {
				toggleHelper.height(elem.outerHeight());
			}
			
			if(options.openOnEnter) {
	      toggleHelper.bind('mouseover', function(e, data) {
	        self._uiOpen(e, data);
	      });
	    }
	
			if(options.closeOnLeave) {
	      toggleHelper.add(elem).hover(
	        function(e, data) {
	          if(self.uiCloseTimeout) { clearTimeout(self.uiCloseTimeout); }
	        },
	        function(e, data) {
	          self._uiClose(e, data);
	        }
	      );
	    }
		}

    if(options.closeOnLoad) {
      self._uiClose();
    } else {
			if(options.contentHidden) {
				if(options.effectType == 'slide2') {
					elem.css(
						ref, -(ref == vAttr ? elem.outerHeight() : elem.outerWidth())
					);
				}
				elem.hide();
				self._isOpen = false;
			}
		}
    
    this.element.bind('open.smarttoggle', function(e, data) {
      self._uiOpen(e, data);
    });
    this.element.bind('close.smarttoggle', function(e, data) {
      self._uiClose(e, data);
    });
  },
  _uiOpen: function(e, data) {
    var me = this, o = this.options;
    
    if(me._isBusy || me._isOpen || o.disabled) { return false; }
    
    me._isBusy = true;
    me._trigger('openStart', e, me);
    me.uiOpenTimeout = setTimeout(function() {
      me.element.show(o.effectType, { direction: o.direction, mode: 'show', easing: o.easing }, o.speed, function() {
        me._isOpen = !(me._isBusy = false);
        me._trigger('openStop', e, me);
         
        if(o.closeOnBlur) {
          $(document).bind('click.smarttoggle', function(e, data) {
						// if clicking anywhere inside the content area, then return
						if(me.element[0] == e.target || $.inArray(me.element[0], $.makeArray($(e.target).parents())) != -1) { return; }
						// otherwise close it
            $(this).unbind('click.smarttoggle');
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
        
        me.element.hide(o.effectType, { direction: o.direction, mode: 'hide', easing: o.easing }, o.speed, function() {
          me._isOpen = me._isBusy = false;
          me._trigger('closeStop', e, me);
        });
      }
    }, data || (e && /click/.test(e.type) ? 0 : o.closeDelay));
  },
  _trigger: function(type, e, ui) {
		return $.widget.prototype._trigger.call(this, type, e, ui);
	}
};


$.widget("ui.smarttoggle", SmartToggle);
$.ui.smarttoggle.defaults = {
  toggleHelper: null,
	adjustToggleHeight: true,
	contentHidden: true,
  openOnEnter: true,
  closeOnLoad: false,
  closeOnLeave: true,
  closeOnBlur: true,
  closeDelay: 500,
  direction: 'up',
  easing: 'swing',
  speed: 500,
  effectType: 'slide2'
};

})(jQuery);