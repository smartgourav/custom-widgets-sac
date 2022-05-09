(function () {
    let version = "1.0.0";
    let template = document.createElement('template');
    template.innerHTML = `<link rel="stylesheet" type="text/css" href="https://github.wdf.sap.corp/ariba-analytics/custom-widgets/blob/main/datepicker/releases/1.0/src/light.css"/>`;

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
            }).addStyleClass("datePicker");
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
            if (value == undefined || !this.DP) return;
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

            var id = this.DP.getId();
            jQuery(id).css({"color" : fontColor});
        }

        set backgroundColor(backgroundColor) {
            if (!this.DP) return;

            var id = this.DP.getId();
            jQuery(id).css({"background-color" : backgroundColor});
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
