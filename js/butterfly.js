// Author: Vladislav Parsenyuk

; (function ($) {
    'use strict';


    var defaults = {
        container: null,
        points: [],
    };


    class Butterfly {
        constructor(options) {
            this.settings = Object.assign({}, defaults, options);
            this.$container = $(this.settings.container);
            this.$el = null;
            this.pointIndex = 0;
            this.points = this.settings.points;
            this.lastPosition = this.getPosition(this.points[this.pointIndex]);
            this.attach();
        }

        attach() {
            this.$el = $('<div id="butterfly"></div>').css(this.lastPosition);

            $(window)
                .on('scroll', () => this.onScroll())
                .on('resize', () => this.onResize());

            this.$el
                .on('mouseenter', () => this.flyToNextPoint())
                .on('transitionend', (e) => this.finishFly(e));
            
            this.$el.appendTo(this.$container);
        }

        flyToNextPoint() {
            if (this.pointIndex + 1 >= this.points.length) {
                this.pointIndex = 0;
            } else {
                this.pointIndex += 1;
            }
            this.fly(this.points[this.pointIndex]);
        }

        flyToPoint(pointId) {
            var point = this.points.find(p => p.id == pointId);

            if (point) {
                var pointIndex = this.points.indexOf(point);
                
                if (pointIndex != this.pointIndex) {
                    this.pointIndex = pointIndex;
                    this.fly(point);
                }
            }
        }

        fly(point) {
            var position = this.getPosition(point);
            var isDifferent = this.lastPosition.left != position.left || this.lastPosition.top != position.top;

            if (isDifferent) {
                this.lastPosition = position;
                var angle = this.getAngle(position);

                this.$el
                    .addClass('fly')
                    .attr('data-type', point.type || '')
                    .css({
                        left: position.left,
                        top: position.top,
                        transform: `rotateZ(${angle}rad)`,
                    });
            }
        }

        finishFly(e) {
            var transitionProperty = e.originalEvent.propertyName;

            if (transitionProperty == 'top' || transitionProperty == 'left') {
                this.$el
                    .removeClass('fly')
                    .css({ transform: '' });
            }
        }

        getPosition(point) {
            var containerOffset = this.$container.offset();
            var pointOffset = point.el && $(point.el).offset() || { left: 0, top: 0 };

            return {
                left: pointOffset.left - containerOffset.left + (point.x || 0),
                top: pointOffset.top - containerOffset.top + (point.y || 0),
            };
        }

        getAngle(position) {
            var containerOffset = this.$container.offset();
            var elOffset = this.$el.offset();
            var x = position.left - elOffset.left + containerOffset.left;
            var y = elOffset.top - containerOffset.top - position.top;

            return Math.atan2(x, y);
        }

        onScroll() {
            var $win = $(window);
            var $doc = $(document);
            var scrollTop = $win.scrollTop();
            var winHeight = $win.height();
            var docHeight = $doc.height();

            if (scrollTop == 0) {
                this.flyToPoint('topPoint');
            }
            else if (scrollTop + winHeight >= docHeight) {
                this.flyToPoint('bottomPoint');
            }
        }

        onResize() {
            this.fly(this.points[this.pointIndex]);
        }
    }


    window.Butterfly = Butterfly;

    
})(jQuery);