(function () {
    let version = "1.0.0";
    let template = document.createElement('template');
    template.innerHTML = `<link rel="stylesheet" type="text/css" href="https://smartgourav.github.io/custom-widgets-sac/datepicker/releases/1.0/src/light.css"/>`;

    class DatePicker extends HTMLElement {
        constructor() {
            super();
            this.init();
        }

        init(skipChildrenCheck) {
            if (skipChildrenCheck !== true && this.children.length === 2) return; //constructor called during drag+drop
            if (!this.querySelector("link")) {
                this.appendChild(template.content.cloneNode(true));
            }

            var uniqueId = Math.floor(Math.random() * Date.now())
            var ctor = sap.m.DatePicker;
            if (this._enableRange) { ctor = sap.m.DateRangeSelection; }
            this.DP = new ctor(uniqueId, {
                change: function () {
                    this.fireChanged();
                    this.dispatchEvent(new Event("onChange"));
                }.bind(this)
            })//.addStyleClass("datePicker");

            this.sId = this.DP.sId;
            if (this._format) {
                this.DP.setDisplayFormat(this._format);
            }
            if (this._minDate) {
                this.updateMinDate();
            }
            if (this._maxDate) {
                this.updateMaxDate();
            }

            this.DP.placeAt(this);

            if (this._fontColor) {
                var id = "#" + this.DP.getId() + "-inner";
                if (this.querySelector(id)) {
                    this.querySelector(id).style.color = fontColor;
                }
            }
            if (this._backgroundColor) {
                var id = "#" + this.DP.getId() + "-inner";
                if (this.querySelector(id)) {
                    this.querySelector(id).style.backgroundColor = backgroundColor;
                }
            }
        }

        fireChanged() {
            var properties = { firstDate: this.DP.getDateValue() };
            if (this._enableRange) { properties.secondDate = this.DP.getSecondDateValue(); }
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: properties
                }
            }));
        }

        set firstDate(value) {
            if (value == undefined || !this.DP) return;
            if (typeof (value) === "string") value = new Date(value);
            this.DP.setDateValue(value);
        }

        set secondDate(value) {
            if (value == undefined || !this.DP || !this._enableRange) return;
            if (typeof (value) === "string") value = new Date(value);
            this.DP.setSecondDateValue(value);
        }

        set format(value) {
            if (!this.DP) return;
            this._format = value;
            this.DP.setDisplayFormat(value);
        }

        set enableRange(value) {
            if (value === undefined || value === false || !this.DP) return;
            this._enableRange = value;
            this.DP.destroy();
            this.init(true);
        }

        set minDate(date) {
            if (!this.DP) return;
            this._minDate = date;
            this.updateMinDate();
        }

        set maxDate(date) {
            if (!this.DP) return;
            this._maxDate = date;
            this.updateMaxDate();
        }

        set fontColor(fontColor) {
            if (!this.DP) return;

            this._fontColor = fontColor;

            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = `.${this.sId}-color input[type="text"] { color: ${fontColor}; } .${this.sId}-color span { color: ${fontColor}; }`;
            document.getElementsByTagName('head')[0].appendChild(style);
            this.DP.addStyleClass(`${this.sId}-color`);
            /*var id = "#" + this.DP.getId() + "-inner";
            if (this.querySelector(id)) {
                this.querySelector(id).style.color = fontColor;
            }*/



            //jQuery(id).css({"color" : fontColor});
        }

        set backgroundColor(backgroundColor) {
            if (!this.DP) return;

            this._backgroundColor = backgroundColor;

            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = `.${this.sId}-backgroundColor input[type="text"] { background-color: ${backgroundColor}; } .${this.sId}-backgroundColor span { background-color: ${backgroundColor}; }`;
            document.getElementsByTagName('head')[0].appendChild(style);
            this.DP.addStyleClass(`${this.sId}-backgroundColor`);

            /*var id = "#" + this.DP.getId() + "-inner";
            if (this.querySelector(id)) {
                this.querySelector(id).style.backgroundColor = backgroundColor;
            }*/

            //jQuery(id).css({"background-color" : backgroundColor});
        }

        updateMaxDate() {
            if (!!this._maxDate) {
                if (this.DP.getDateValue() > this._maxDate) {
                    this.DP.setDateValue(this._maxDate);
                }
                if (this._enableRange && this.DP.getSecondDateValue() > this._maxDate) {
                    this.DP.setSecondDateValue(this._maxDate);
                }
            }
            this.DP.setMaxDate(this._maxDate);
        }

        updateMinDate() {
            if (!!this._maxDate) {
                if (this.DP.getDateValue() < this._minDate) {
                    this.DP.setDateValue(this._minDate);
                }
                if (this._enableRange && this.DP.getSecondDateValue() < this._minDate) {
                    this.DP.setSecondDateValue(this._minDate);
                }
            }
            this.DP.setMinDate(this._minDate);
        }
    }

    customElements.define('sap-date-picker', DatePicker);
})();
