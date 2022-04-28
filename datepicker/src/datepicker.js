(function () {
    let version = "1.0.0";
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `<link rel="stylesheet" type="text/css" href="https://github.wdf.sap.corp/ariba-analytics/custom-widgets/blob/main/datepicker/src/light.css"/>`;

    class DatePicker extends HTMLElement {
        constructor() {
            super();
            this.init();
        }

        init(skipChildrenCheck) {
            if (skipChildrenCheck !== true && this.children.length === 2) return; //constructor called during drag+drop
            if (!this.querySelector("link")) {
                this.appendChild(tmpl.content.cloneNode(true));
            }
            var ctor = sap.m.DatePicker;
            if (this._enableRange) { ctor = sap.m.DateRangeSelection; }
            this.DP = new ctor({
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
            var properties = { firstDateVal: this.DP.getDateValue() };
            if (this._enableRange) { properties.secondDateVal = this.DP.getSecondDateValue(); }
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

        set darktheme(value) {
            this.querySelector("link").setAttribute("href", `https://github.wdf.sap.corp/ariba-analytics/custom-widgets/blob/main/datepicker/src/${value ? "dark.css" : "light.css"}`
            );
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
