// Author: Vladislav Parsenyuk

; (function ($) {
    'use strict';

    
    var defaults = {
        radius: 200,
    };


    class Entanglement {
        constructor(el, options) {
            this.settings = Object.assign({}, defaults, options);
            this.$el = $(el);
            this.$symbols = null;
            this.init();
        }

        init() {
            this.$symbols = this.wrapSymbols();

            this.$el
                .on('mouseenter', () => this.normalize())
                .on('mouseleave', () => this.randomize());

            this.cachePosition();
            this.randomize();
        }

        wrapSymbols() {
            function wrap(node) {
                $(node).contents().each((i, node) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        var wrappedSymbols = node.nodeValue.replace(/(\S)/g, '<span class="entangled-symbol">$1</span>');
                        $(node).replaceWith(wrappedSymbols);
                    } else {
                        wrap(node);
                    }
                });
            }

            wrap(this.$el);
            return this.$el.find('.entangled-symbol');
        }

        cachePosition() {
            var rootRect = this.$el[0].getBoundingClientRect();

            this.$symbols.each((i, symbol) => {
                var symbolRect = symbol.getBoundingClientRect();

                $(symbol).data('entangledCenter', {
                    x: rootRect.left + rootRect.width / 2 - symbolRect.left - symbolRect.width / 2,
                    y: rootRect.top + rootRect.height / 2 - symbolRect.top - symbolRect.height / 2,
                });
            });
        }

        randomize() {
            var radius = this.settings.radius;
            var random = (min, max) => Math.random() * (max - min) + min;

            this.$symbols.each((i, symbol) => {
                var center = $.data(symbol, 'entangledCenter');
                var randomX = random(-radius, radius);
                var maxRandomY = Math.sqrt(Math.pow(radius, 2) - Math.pow(randomX, 2));
                var randomY = random(-maxRandomY, maxRandomY);
                var x = center.x + randomX;
                var y = center.y + randomY;
                var angle = random(0, 360);

                $(symbol).css({
                    transform: `translateX(${x}px) translateY(${y}px) rotateZ(${angle}deg)`,
                });
            });
        }

        normalize() {
            this.$symbols.css({ transform: 'none' });
        }
    }


    $.fn.entangle = function (options) {
        return this.each(function () {
            if (!$.data(this, 'entanglement')) {
                $.data(this, 'entanglement', new Entanglement(this, options));
            }
        });
    };

    
})(jQuery);