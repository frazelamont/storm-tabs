(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _stormTabs = require('./libs/storm-tabs');

var _stormTabs2 = _interopRequireDefault(_stormTabs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onDOMContentLoadedTasks = [function () {
  _stormTabs2.default.init('.js-tabs');
}];

if ('addEventListener' in window) window.addEventListener('DOMContentLoaded', function () {
  onDOMContentLoadedTasks.forEach(function (fn) {
    return fn();
  });
});

},{"./libs/storm-tabs":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * @name storm-tabs: Multi-panelled content areas 
 * @version 0.6.0: Tue, 28 Feb 2017 22:24:37 GMT
 * @author mjbp
 * @license MIT
 */
var KEY_CODES = {
	SPACE: 32,
	ENTER: 13,
	TAB: 9,
	LEFT: 37,
	RIGHT: 39,
	UP: 38,
	DOWN: 40
},
    defaults = {
	titleClass: '.js-tabs__link',
	currentClass: 'active',
	active: 0
},
    StormTabs = {
	init: function init() {
		var _this = this;

		var hash = location.hash.slice(1) || null;

		this.links = [].slice.call(this.DOMElement.querySelectorAll(this.settings.titleClass));
		this.targets = this.links.map(function (el) {
			return document.getElementById(el.getAttribute('href').substr(1)) || console.error('Tab target not found');
		});

		!!this.links.length && this.links[0].parentNode.setAttribute('role', 'tablist');

		this.current = this.settings.active;

		if (hash) {
			this.targets.forEach(function (target, i) {
				if (target.getAttribute('id') === hash) {
					_this.current = i;
				}
			});
		}

		this.initAria().initTitles().open(this.current);

		return this;
	},
	initAria: function initAria() {
		var _this2 = this;

		this.links.forEach(function (el, i) {
			el.setAttribute('role', 'tab');
			el.setAttribute('aria-expanded', false);
			el.setAttribute('aria-selected', false);
			el.setAttribute('aria-controls', _this2.targets[i].getAttribute('id'));
		});

		this.targets.forEach(function (el) {
			el.setAttribute('role', 'tabpanel');
			el.setAttribute('aria-hidden', true);
			el.setAttribute('tabIndex', '-1');
		});
		return this;
	},
	initTitles: function initTitles() {
		var _this3 = this;

		var handler = function handler(i) {
			_this3.toggle(i);
		};

		this.lastFocusedTab = 0;

		this.links.forEach(function (el, i) {
			//navigate
			el.addEventListener('keydown', function (e) {
				switch (e.keyCode) {
					case KEY_CODES.UP:
						e.preventDefault();
						_this3.toggle(_this3.current === 0 ? _this3.links.length - 1 : _this3.current - 1);
						window.setTimeout(function () {
							_this3.links[_this3.current].focus();
						}, 16);
						break;
					case KEY_CODES.LEFT:
						_this3.toggle(_this3.current === 0 ? _this3.links.length - 1 : _this3.current - 1);
						window.setTimeout(function () {
							_this3.links[_this3.current].focus();
						}, 16);
						break;
					case KEY_CODES.DOWN:
						e.preventDefault();
						_this3.toggle(_this3.current === _this3.links.length - 1 ? 0 : _this3.current + 1);
						window.setTimeout(function () {
							_this3.links[_this3.current].focus();
						}, 16);
						break;
					case KEY_CODES.RIGHT:
						_this3.toggle(_this3.current === _this3.links.length - 1 ? 0 : _this3.current + 1);
						window.setTimeout(function () {
							_this3.links[_this3.current].focus();
						}, 16);
						break;
					case KEY_CODES.ENTER:
						handler.call(_this3, i);
						window.setTimeout(function () {
							_this3.links[i].focus();
						}, 16);
						break;
					case KEY_CODES.SPACE:
						e.preventDefault();
						handler.call(_this3, i);
						window.setTimeout(function () {
							_this3.links[i].focus();
						}, 16);
						break;
					case KEY_CODES.TAB:
						e.preventDefault();
						e.stopPropagation();
						_this3.lastFocusedTab = _this3.getLinkIndex(e.target);
						_this3.setTargetFocus(_this3.lastFocusedTab);
						handler.call(_this3, i);
						break;
					default:
						//
						break;
				}
			});

			//toggle
			el.addEventListener('click', function (e) {
				e.preventDefault();
				handler.call(_this3, i);
			}, false);
		});

		return this;
	},
	getLinkIndex: function getLinkIndex(link) {
		for (var i = 0; i < this.links.length; i++) {
			if (link === this.links[i]) return i;
		}
		return null;
	},
	getFocusableChildren: function getFocusableChildren(node) {
		var focusableElements = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabIndex]:not([tabIndex="-1"])'];
		return [].slice.call(node.querySelectorAll(focusableElements.join(',')));
	},
	setTargetFocus: function setTargetFocus(tabIndex) {
		this.focusableChildren = this.getFocusableChildren(this.targets[tabIndex]);

		if (this.focusableChildren.length) {
			window.setTimeout(function () {
				this.focusableChildren[0].focus();
				this.keyEventListener = this.keyListener.bind(this);

				document.addEventListener('keydown', this.keyEventListener);
			}.bind(this), 0);
		}
	},
	keyListener: function keyListener(e) {
		if (e.keyCode !== KEY_CODES.TAB) {
			return;
		}
		var focusedIndex = this.focusableChildren.indexOf(document.activeElement);

		if (focusedIndex < 0) {
			document.removeEventListener('keydown', this.keyEventListener);
			return;
		}

		if (e.shiftKey && focusedIndex === 0) {
			e.preventDefault();
			this.focusableChildren[this.focusableChildren.length - 1].focus();
		} else {
			if (!e.shiftKey && focusedIndex === this.focusableChildren.length - 1) {
				document.removeEventListener('keydown', this.keyEventListener);
				if (this.lastFocusedTab !== this.links.length - 1) {
					e.preventDefault();
					this.lastFocusedTab = this.lastFocusedTab + 1;
					this.links[this.lastFocusedTab].focus();
				}
			}
		}
	},
	change: function change(type, i) {
		var methods = {
			open: {
				classlist: 'add',
				tabIndex: {
					target: this.targets[i],
					value: '0'
				}
			},
			close: {
				classlist: 'remove',
				tabIndex: {
					target: this.targets[this.current],
					value: '-1'
				}
			}
		};

		this.links[i].classList[methods[type].classlist](this.settings.currentClass);
		this.targets[i].classList[methods[type].classlist](this.settings.currentClass);
		this.targets[i].setAttribute('aria-hidden', this.targets[i].getAttribute('aria-hidden') === 'true' ? 'false' : 'true');
		this.links[i].setAttribute('aria-selected', this.links[i].getAttribute('aria-selected') === 'true' ? 'false' : 'true');
		this.links[i].setAttribute('aria-expanded', this.links[i].getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
		methods[type].tabIndex.target.setAttribute('tabIndex', methods[type].tabIndex.value);
	},
	open: function open(i) {
		this.change('open', i);
		this.current = i;
		return this;
	},
	close: function close(i) {
		this.change('close', i);
		return this;
	},
	toggle: function toggle(i) {
		if (this.current === i) return;

		window.history.pushState({ URL: this.links[i].getAttribute('href') }, '', this.links[i].getAttribute('href'));

		if (this.current === null) {
			this.open(i);
			return this;
		}
		this.close(this.current).open(i);

		return this;
	}
};

var init = function init(sel, opts) {
	var els = [].slice.call(document.querySelectorAll(sel));

	if (!els.length) throw new Error('Tabs cannot be initialised, no augmentable elements found');

	return els.map(function (el) {
		return Object.assign(Object.create(StormTabs), {
			DOMElement: el,
			settings: Object.assign({}, defaults, opts)
		}).init();
	});
};

exports.default = { init: init };

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL3N0b3JtLXRhYnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQSxJQUFNLDBCQUEwQixDQUFDLFlBQU07QUFDdEMsc0JBQUssSUFBTCxDQUFVLFVBQVY7QUFDQSxDQUYrQixDQUFoQzs7QUFJQSxJQUFHLHNCQUFzQixNQUF6QixFQUFpQyxPQUFPLGdCQUFQLENBQXdCLGtCQUF4QixFQUE0QyxZQUFNO0FBQUUsMEJBQXdCLE9BQXhCLENBQWdDLFVBQUMsRUFBRDtBQUFBLFdBQVEsSUFBUjtBQUFBLEdBQWhDO0FBQWdELENBQXBHOzs7Ozs7OztBQ05qQzs7Ozs7O0FBTUEsSUFBTSxZQUFZO0FBQ2hCLFFBQU8sRUFEUztBQUVoQixRQUFPLEVBRlM7QUFHaEIsTUFBSyxDQUhXO0FBSWhCLE9BQU0sRUFKVTtBQUtoQixRQUFPLEVBTFM7QUFNaEIsS0FBRyxFQU5hO0FBT2hCLE9BQU07QUFQVSxDQUFsQjtBQUFBLElBU0MsV0FBVztBQUNWLGFBQVksZ0JBREY7QUFFVixlQUFjLFFBRko7QUFHVixTQUFRO0FBSEUsQ0FUWjtBQUFBLElBY0MsWUFBWTtBQUNYLEtBRFcsa0JBQ0o7QUFBQTs7QUFDTixNQUFJLE9BQU8sU0FBUyxJQUFULENBQWMsS0FBZCxDQUFvQixDQUFwQixLQUEwQixJQUFyQzs7QUFFQSxPQUFLLEtBQUwsR0FBYSxHQUFHLEtBQUgsQ0FBUyxJQUFULENBQWMsS0FBSyxVQUFMLENBQWdCLGdCQUFoQixDQUFpQyxLQUFLLFFBQUwsQ0FBYyxVQUEvQyxDQUFkLENBQWI7QUFDQSxPQUFLLE9BQUwsR0FBZSxLQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsY0FBTTtBQUNuQyxVQUFPLFNBQVMsY0FBVCxDQUF3QixHQUFHLFlBQUgsQ0FB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UDtBQUlBLEVBTE0sQ0FBUDtBQU1BLENBWEQ7O2tCQWFlLEVBQUUsVUFBRixFIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBUYWJzIGZyb20gJy4vbGlicy9zdG9ybS10YWJzJztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuXHRUYWJzLmluaXQoJy5qcy10YWJzJyk7XG59XTtcbiAgICBcbmlmKCdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4geyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKChmbikgPT4gZm4oKSk7IH0pOyIsIi8qKlxuICogQG5hbWUgc3Rvcm0tdGFiczogTXVsdGktcGFuZWxsZWQgY29udGVudCBhcmVhcyBcbiAqIEB2ZXJzaW9uIDAuNi4wOiBUdWUsIDI4IEZlYiAyMDE3IDIyOjI0OjM3IEdNVFxuICogQGF1dGhvciBtamJwXG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuY29uc3QgS0VZX0NPREVTID0ge1xuXHRcdFNQQUNFOiAzMixcblx0XHRFTlRFUjogMTMsXG5cdFx0VEFCOiA5LFxuXHRcdExFRlQ6IDM3LFxuXHRcdFJJR0hUOiAzOSxcblx0XHRVUDozOCxcblx0XHRET1dOOiA0MFxuXHR9LFxuXHRkZWZhdWx0cyA9IHtcblx0XHR0aXRsZUNsYXNzOiAnLmpzLXRhYnNfX2xpbmsnLFxuXHRcdGN1cnJlbnRDbGFzczogJ2FjdGl2ZScsXG5cdFx0YWN0aXZlOiAwXG5cdH0sXG5cdFN0b3JtVGFicyA9IHtcblx0XHRpbml0KCkge1xuXHRcdFx0bGV0IGhhc2ggPSBsb2NhdGlvbi5oYXNoLnNsaWNlKDEpIHx8IG51bGw7XG5cblx0XHRcdHRoaXMubGlua3MgPSBbXS5zbGljZS5jYWxsKHRoaXMuRE9NRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuc2V0dGluZ3MudGl0bGVDbGFzcykpO1xuXHRcdFx0dGhpcy50YXJnZXRzID0gdGhpcy5saW5rcy5tYXAoZWwgPT4ge1xuXHRcdFx0XHRyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWwuZ2V0QXR0cmlidXRlKCdocmVmJykuc3Vic3RyKDEpKSB8fCBjb25zb2xlLmVycm9yKCdUYWIgdGFyZ2V0IG5vdCBmb3VuZCcpO1xuXHRcdFx0fSk7XG5cblx0XHRcdCEhdGhpcy5saW5rcy5sZW5ndGggJiYgdGhpcy5saW5rc1swXS5wYXJlbnROb2RlLnNldEF0dHJpYnV0ZSgncm9sZScsICd0YWJsaXN0Jyk7XG5cblx0XHRcdHRoaXMuY3VycmVudCA9IHRoaXMuc2V0dGluZ3MuYWN0aXZlO1xuXG5cdFx0XHRpZiAoaGFzaCkge1xuXHRcdFx0XHR0aGlzLnRhcmdldHMuZm9yRWFjaCgodGFyZ2V0LCBpKSA9PiB7XG5cdFx0XHRcdFx0aWYgKHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09IGhhc2gpIHtcblx0XHRcdFx0XHRcdHRoaXMuY3VycmVudCA9IGk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5pbml0QXJpYSgpXG5cdFx0XHRcdC5pbml0VGl0bGVzKClcblx0XHRcdFx0Lm9wZW4odGhpcy5jdXJyZW50KTtcblxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblx0XHRpbml0QXJpYSgpIHtcblx0XHRcdHRoaXMubGlua3MuZm9yRWFjaCgoZWwsIGkpID0+IHtcblx0XHRcdFx0ZWwuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYicpO1xuXHRcdFx0XHRlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XG5cdFx0XHRcdGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIGZhbHNlKTtcblx0XHRcdFx0ZWwuc2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJywgdGhpcy50YXJnZXRzW2ldLmdldEF0dHJpYnV0ZSgnaWQnKSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy50YXJnZXRzLmZvckVhY2goZWwgPT4ge1xuXHRcdFx0XHRlbC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFicGFuZWwnKTtcblx0XHRcdFx0ZWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuXHRcdFx0XHRlbC5zZXRBdHRyaWJ1dGUoJ3RhYkluZGV4JywgJy0xJyk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cdFx0aW5pdFRpdGxlcygpIHtcblx0XHRcdGxldCBoYW5kbGVyID0gaSA9PiB7XG5cdFx0XHRcdHRoaXMudG9nZ2xlKGkpO1xuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy5sYXN0Rm9jdXNlZFRhYiA9IDA7XG5cblx0XHRcdHRoaXMubGlua3MuZm9yRWFjaCgoZWwsIGkpID0+IHtcblx0XHRcdFx0Ly9uYXZpZ2F0ZVxuXHRcdFx0XHRlbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZSA9PiB7XG5cdFx0XHRcdFx0c3dpdGNoIChlLmtleUNvZGUpIHtcblx0XHRcdFx0XHRjYXNlIEtFWV9DT0RFUy5VUDpcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdHRoaXMudG9nZ2xlKCh0aGlzLmN1cnJlbnQgPT09IDAgPyB0aGlzLmxpbmtzLmxlbmd0aCAtIDEgOiB0aGlzLmN1cnJlbnQgLSAxKSk7XG5cdFx0XHRcdFx0XHR3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IHRoaXMubGlua3NbdGhpcy5jdXJyZW50XS5mb2N1cygpOyB9LCAxNik7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIEtFWV9DT0RFUy5MRUZUOlxuXHRcdFx0XHRcdFx0dGhpcy50b2dnbGUoKHRoaXMuY3VycmVudCA9PT0gMCA/IHRoaXMubGlua3MubGVuZ3RoIC0gMSA6IHRoaXMuY3VycmVudCAtIDEpKTtcblx0XHRcdFx0XHRcdHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5saW5rc1t0aGlzLmN1cnJlbnRdLmZvY3VzKCk7IH0sIDE2KTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgS0VZX0NPREVTLkRPV046XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHR0aGlzLnRvZ2dsZSgodGhpcy5jdXJyZW50ID09PSB0aGlzLmxpbmtzLmxlbmd0aCAtIDEgPyAwIDogdGhpcy5jdXJyZW50ICsgMSkpO1xuXHRcdFx0XHRcdFx0d2luZG93LnNldFRpbWVvdXQoKCkgPT4geyB0aGlzLmxpbmtzW3RoaXMuY3VycmVudF0uZm9jdXMoKTsgfSwgMTYpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBLRVlfQ09ERVMuUklHSFQ6XG5cdFx0XHRcdFx0XHR0aGlzLnRvZ2dsZSgodGhpcy5jdXJyZW50ID09PSB0aGlzLmxpbmtzLmxlbmd0aCAtIDEgPyAwIDogdGhpcy5jdXJyZW50ICsgMSkpO1xuXHRcdFx0XHRcdFx0d2luZG93LnNldFRpbWVvdXQoKCkgPT4geyB0aGlzLmxpbmtzW3RoaXMuY3VycmVudF0uZm9jdXMoKTsgfSwgMTYpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBLRVlfQ09ERVMuRU5URVI6XG5cdFx0XHRcdFx0XHRoYW5kbGVyLmNhbGwodGhpcywgaSk7XG5cdFx0XHRcdFx0XHR3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IHRoaXMubGlua3NbaV0uZm9jdXMoKTsgfSwgMTYpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBLRVlfQ09ERVMuU1BBQ0U6XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRoYW5kbGVyLmNhbGwodGhpcywgaSk7XG5cdFx0XHRcdFx0XHR3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7IHRoaXMubGlua3NbaV0uZm9jdXMoKTsgfSwgMTYpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBLRVlfQ09ERVMuVEFCOlxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRcdHRoaXMubGFzdEZvY3VzZWRUYWIgPSB0aGlzLmdldExpbmtJbmRleChlLnRhcmdldCk7XG5cdFx0XHRcdFx0XHR0aGlzLnNldFRhcmdldEZvY3VzKHRoaXMubGFzdEZvY3VzZWRUYWIpO1xuXHRcdFx0XHRcdFx0aGFuZGxlci5jYWxsKHRoaXMsIGkpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0Ly9cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly90b2dnbGVcblx0XHRcdFx0ZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0aGFuZGxlci5jYWxsKHRoaXMsIGkpOyAgXG5cdFx0XHRcdH0sIGZhbHNlKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXHRcdGdldExpbmtJbmRleChsaW5rKXtcblx0XHRcdGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmxpbmtzLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0aWYobGluayA9PT0gdGhpcy5saW5rc1tpXSkgcmV0dXJuIGk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9LFxuXHRcdGdldEZvY3VzYWJsZUNoaWxkcmVuKG5vZGUpIHtcblx0XHRcdGxldCBmb2N1c2FibGVFbGVtZW50cyA9IFsnYVtocmVmXScsICdhcmVhW2hyZWZdJywgJ2lucHV0Om5vdChbZGlzYWJsZWRdKScsICdzZWxlY3Q6bm90KFtkaXNhYmxlZF0pJywgJ3RleHRhcmVhOm5vdChbZGlzYWJsZWRdKScsICdidXR0b246bm90KFtkaXNhYmxlZF0pJywgJ2lmcmFtZScsICdvYmplY3QnLCAnZW1iZWQnLCAnW2NvbnRlbnRlZGl0YWJsZV0nLCAnW3RhYkluZGV4XTpub3QoW3RhYkluZGV4PVwiLTFcIl0pJ107XG5cdFx0XHRyZXR1cm4gW10uc2xpY2UuY2FsbChub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNhYmxlRWxlbWVudHMuam9pbignLCcpKSk7XG5cdFx0fSxcblx0XHRzZXRUYXJnZXRGb2N1cyh0YWJJbmRleCl7XG5cdFx0XHR0aGlzLmZvY3VzYWJsZUNoaWxkcmVuID0gdGhpcy5nZXRGb2N1c2FibGVDaGlsZHJlbih0aGlzLnRhcmdldHNbdGFiSW5kZXhdKTtcblx0XHRcdFxuXHRcdFx0aWYodGhpcy5mb2N1c2FibGVDaGlsZHJlbi5sZW5ndGgpe1xuXHRcdFx0XHR3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW5bMF0uZm9jdXMoKTtcblx0XHRcdFx0XHR0aGlzLmtleUV2ZW50TGlzdGVuZXIgPSB0aGlzLmtleUxpc3RlbmVyLmJpbmQodGhpcyk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMua2V5RXZlbnRMaXN0ZW5lcik7XG5cdFx0XHRcdH0uYmluZCh0aGlzKSwgMCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRrZXlMaXN0ZW5lcihlKXtcblx0XHRcdGlmIChlLmtleUNvZGUgIT09IEtFWV9DT0RFUy5UQUIpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0bGV0IGZvY3VzZWRJbmRleCA9IHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW4uaW5kZXhPZihkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcblx0XHRcdFxuXHRcdFx0aWYoZm9jdXNlZEluZGV4IDwgMCkge1xuXHRcdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5rZXlFdmVudExpc3RlbmVyKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRpZihlLnNoaWZ0S2V5ICYmIGZvY3VzZWRJbmRleCA9PT0gMCkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHRoaXMuZm9jdXNhYmxlQ2hpbGRyZW5bdGhpcy5mb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggLSAxXS5mb2N1cygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYoIWUuc2hpZnRLZXkgJiYgZm9jdXNlZEluZGV4ID09PSB0aGlzLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5rZXlFdmVudExpc3RlbmVyKTtcblx0XHRcdFx0XHRpZih0aGlzLmxhc3RGb2N1c2VkVGFiICE9PSB0aGlzLmxpbmtzLmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdHRoaXMubGFzdEZvY3VzZWRUYWIgPSB0aGlzLmxhc3RGb2N1c2VkVGFiICsgMTtcblx0XHRcdFx0XHRcdHRoaXMubGlua3NbdGhpcy5sYXN0Rm9jdXNlZFRhYl0uZm9jdXMoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdGNoYW5nZSh0eXBlLCBpKSB7XG5cdFx0XHRsZXQgbWV0aG9kcyA9IHtcblx0XHRcdFx0b3Blbjoge1xuXHRcdFx0XHRcdGNsYXNzbGlzdDogJ2FkZCcsXG5cdFx0XHRcdFx0dGFiSW5kZXg6IHtcblx0XHRcdFx0XHRcdHRhcmdldDogdGhpcy50YXJnZXRzW2ldLFxuXHRcdFx0XHRcdFx0dmFsdWU6ICcwJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0Y2xvc2U6IHtcblx0XHRcdFx0XHRjbGFzc2xpc3Q6ICdyZW1vdmUnLFxuXHRcdFx0XHRcdHRhYkluZGV4OiB7XG5cdFx0XHRcdFx0XHR0YXJnZXQ6IHRoaXMudGFyZ2V0c1t0aGlzLmN1cnJlbnRdLFxuXHRcdFx0XHRcdFx0dmFsdWU6ICctMSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdHRoaXMubGlua3NbaV0uY2xhc3NMaXN0W21ldGhvZHNbdHlwZV0uY2xhc3NsaXN0XSh0aGlzLnNldHRpbmdzLmN1cnJlbnRDbGFzcyk7XG5cdFx0XHR0aGlzLnRhcmdldHNbaV0uY2xhc3NMaXN0W21ldGhvZHNbdHlwZV0uY2xhc3NsaXN0XSh0aGlzLnNldHRpbmdzLmN1cnJlbnRDbGFzcyk7XG5cdFx0XHR0aGlzLnRhcmdldHNbaV0uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRoaXMudGFyZ2V0c1tpXS5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykgPT09ICd0cnVlJyA/ICdmYWxzZScgOiAndHJ1ZScgKTtcblx0XHRcdHRoaXMubGlua3NbaV0uc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgdGhpcy5saW5rc1tpXS5nZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnKSA9PT0gJ3RydWUnID8gJ2ZhbHNlJyA6ICd0cnVlJyApO1xuXHRcdFx0dGhpcy5saW5rc1tpXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0aGlzLmxpbmtzW2ldLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAndHJ1ZScgPyAnZmFsc2UnIDogJ3RydWUnICk7XG5cdFx0XHRtZXRob2RzW3R5cGVdLnRhYkluZGV4LnRhcmdldC5zZXRBdHRyaWJ1dGUoJ3RhYkluZGV4JywgbWV0aG9kc1t0eXBlXS50YWJJbmRleC52YWx1ZSk7XG5cdFx0XHRcblx0XHR9LFxuXHRcdG9wZW4oaSkge1xuXHRcdFx0dGhpcy5jaGFuZ2UoJ29wZW4nLCBpKTtcblx0XHRcdHRoaXMuY3VycmVudCA9IGk7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXHRcdGNsb3NlKGkpIHtcblx0XHRcdHRoaXMuY2hhbmdlKCdjbG9zZScsIGkpO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblx0XHR0b2dnbGUoaSkge1xuXHRcdFx0aWYodGhpcy5jdXJyZW50ID09PSBpKSByZXR1cm47XG5cblx0XHRcdHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7IFVSTDogdGhpcy5saW5rc1tpXS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSB9LCAnJywgdGhpcy5saW5rc1tpXS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSk7XG5cblx0XHRcdGlmKHRoaXMuY3VycmVudCA9PT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLm9wZW4oaSk7XG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5jbG9zZSh0aGlzLmN1cnJlbnQpXG5cdFx0XHRcdC5vcGVuKGkpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdH07XG5cblxuY29uc3QgaW5pdCA9IChzZWwsIG9wdHMpID0+IHtcblx0bGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpKTtcblx0XG5cdGlmKCFlbHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ1RhYnMgY2Fubm90IGJlIGluaXRpYWxpc2VkLCBubyBhdWdtZW50YWJsZSBlbGVtZW50cyBmb3VuZCcpO1xuXG5cdHJldHVybiBlbHMubWFwKChlbCkgPT4ge1xuXHRcdHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoU3Rvcm1UYWJzKSwge1xuXHRcdFx0RE9NRWxlbWVudDogZWwsXG5cdFx0XHRzZXR0aW5nczogT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdHMpXG5cdFx0fSkuaW5pdCgpO1xuXHR9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyJdfQ==
