(function (window) {

	'use strict';

	class Description {

		static x() {
			return 150;
		}
		static style() {
			return 'text-anchor:start;font-size:12px;fill:#999999;height:36px;letter-spacing:2;';
		}
		static space() {
			return 16;
		}

		constructor(line) {
			this.line = line;
			this.elements = {};
		}

		getLine() {
			return this.line;
		}
		getText() {
			if (this.elements.hasOwnProperty('element')) return this.elements.element;
			this.elements.element = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			this.elements.element.setAttribute('style', this.constructor.style());
			return this.elements.element;
		}
		setText(text) {
			let element = this.getText(),
				label = document.createTextNode(text);

			this.clear();
			element.appendChild(label);
			return this;
		}
		out() {
			return this.getText();
		}
		clear() {
			let element = this.getText();
			while (!!element.firstChild) element.removeChild(element.firstChild);
			return this;
		}
		render() {
			let x = this.getLine().getX() + this.constructor.space(),
				y = this.getLine().getY() + this.constructor.space(),
				t = String.fromCharCode(32) + x + String.fromCharCode(32) + y;

			this.getText().setAttribute('transform', 'matrix(1 0 0 1' + t + ')');
			return this;
		}
	}

	class Line {

		static zx() {
			return 'x1';
		}
		static zy() {
			return 'y1';
		}
		static x() {
			return 'x2';
		}
		static y() {
			return 'y2';
		}
		static stroke() {
			return 2;
		}
		static conversion() {
			return -1;
		}
		static style(color) {
			let properties = 'fill:$c;stroke:$c;stroke-width:$s;';
			if (typeof color !== 'string'
				|| color.length < 3) color = '#000000';

			return properties.replaceAll('$s', window.Line.stroke()).replaceAll('$c', color);
		}

		constructor(phase, title) {
			this.phase = phase;
			this.title = title;

			this.elements = {};
			this.elements.line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			this.elements.line.setAttribute(this.constructor.zx(), window.Phase.zero());
			this.elements.line.setAttribute(this.constructor.zy(), window.Phase.zero());
			this.elements.description = new window.Phase.Line.Description(this);

			this.options = {};
			this.options.size = 0;
			this.options.degrees = 0;

			this.getPhase().getSvg().appendChild(this.elements.description.out());
		}

		getPhase() {
			return this.phase;
		}
		getDescription() {
			return this.elements.description;
		}
		getTitle() {
			return this.title;
		}
		getElement() {
			return this.elements.line;
		}
		setSize(px) {
			this.options.size = px;
			this.draw();
			return this;
		}
		getSize() {
			return this.options.size;
		}
		setColor(color) {
			this.getElement().setAttribute('style', this.constructor.style(color));
			return this;
		}
		setDegrees(degrees) {
			this.options.degrees = degrees;
			this.draw();
			return this;
		}
		getDegrees() {
			return this.options.degrees;
		}
		getRadians() {
			let degrees = this.getDegrees();
			return this.constructor.conversion() * ((degrees * Math.PI) / 180.0);
		}
		out() {
			return this.getElement();
		}
		getX() {
			let l = this.getSize(),
				r = this.getRadians();
			return (Math.cos(r) * l) + window.Phase.zero();
		}
		getY() {
			let l = this.getSize(),
				r = this.getRadians();
			return (Math.sin(r) * l) + window.Phase.zero();
		}
		draw() {
			this.getElement().setAttribute(this.constructor.x(), this.getX());
			this.getElement().setAttribute(this.constructor.y(), this.getY());
			this.getDescription().render();
		}
		static percentage(max, value) {
			return (window.Phase.zero() / max) * value
		}
	}

	class Phase {

		static qbo() {
			return 800;
		}
		static zero() {
			return window.Phase.qbo() / 2;
		}

		constructor() {
			this.elements = {};
			this.elements.lines = [];
		}

		getSvg() {
			if (this.elements.hasOwnProperty('svg')) return this.elements.svg;

			let aspace = [
				this.constructor.qbo(),
				this.constructor.qbo()
			];

			this.elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			this.elements.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
			this.elements.svg.setAttribute('class', 'phase');
			this.elements.svg.setAttribute('version', '1.1');
			this.elements.svg.setAttribute('viewBox', '0 0' + String.fromCharCode(32) + aspace.join(String.fromCharCode(32)));

			return this.elements.svg;
		}
		getLines() {
			return this.elements.lines;
		}
		getLine(title) {
			let lines = this.getLines();
			for (let item = 0; item < lines.length; item++)
				if (title === lines[item].getTitle())
					return lines[item];
			return null;
		}
		setLine(title, text, color, degrees, size) {
			let line = this.getLine(title);
			if (line === null) line = this.createLine(title);
			line.getDescription().setText(text);
			line.setDegrees(degrees);
			line.setColor(color);
			line.setSize(size);
			return this;
		}
		createLine(title) {
			let line = new window.Phase.Line(this, title);
			this.getLines().push(line);
			this.getSvg().appendChild(line.out());
			return line;
		}
		out() {
			return this.getSvg();
		}
	}

	window.Phase = Phase;
	window.Phase.Line = Line;
	window.Phase.Line.Description = Description;

})(window);