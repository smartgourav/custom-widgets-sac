(function () {
    let version = "1.0.0";
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <p>Date Format</p>
        <div class="select">
            <select id="select">
                <option name="date_format" value="YYYY-MM-dd">YYYY-MM-DD</option>
                <option name="date_format" value="MM/dd/YYYY">MM/DD/YYYY</option>
                <option name="date_format" value="dd.MM.YYYY">DD.MM.YYYY</option>
            </select>
        </div>
        <p>Miscellaneous</p>
        <label for="font-color">Font Color</label>
        <input type="text" id="font-color" name="font-color">
        <label for="background-color">Background Color</label>
        <input type="text" id="background-color" name="background-color">
        <label class="checkbox"><input type="checkbox" id="range" /><div class="checkmark" ></div>Enable date range selection</label>
        <p>Minimum Date Value</p>
        <div id="dateMin" ></div>
        <p>Maximum Date Value</p>
        <div id="dateMax" ></div>`;

    class DatePickerAps extends HTMLElement {
        constructor() {
            super();
            this.appendChild(tmpl.content.cloneNode(true));

            if (sap.ui.getCore().byId("dateMin")) {
                sap.ui.getCore().byId("dateMin").destroy();
            }
            this.minDP = new sap.m.DatePicker({
                id: "dateMin",
                change: function (event) {
                    this.minDateVal = event.oSource.getDateValue();
                    this._submit(event);
                }.bind(this)
            });
            this.minDP.placeAt(this.querySelector("#dateMin"));

            if (sap.ui.getCore().byId("dateMax")) {
                sap.ui.getCore().byId("dateMax").destroy();
            }
            this.maxDP = new sap.m.DatePicker({
                id: "dateMax",
                change: function (event) {
                    this.maxDateVal = event.oSource.getDateValue();
                    this._submit(event);
                }.bind(this)
            });
            this.maxDP.placeAt(this.querySelector("#dateMax"));
            ["select", "range"].forEach(id =>
                this.querySelector("#" + id).addEventListener("change", this._submit.bind(this)));
        }

        _submit(e) {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent('propertiesChanged', {
                detail: {
                    properties: {
                        format: this.format,
                        enableRange: this.enableRange,
                        minDate: this.minDate,
                        maxDate: this.maxDate
                    }
                }
            }));
            return false;
        }

        get format() {
            return this.querySelector("option[name='date_format']:checked").value;
        }

        set format(value) {
            this.querySelector("option[name='date_format'][value='" + value + "']").checked = "checked";
        }

        get enableRange() {
            return this.querySelector("#range").checked;
        }

        set enableRange(value) {
            this.querySelector("#range").checked = value
        }

        get minDate() {
            return this.minDP.getDateValue();
        }

        set minDate(date) {
            this.minDP.setDateValue(date);
            this.maxDP.setMinDate(date)
        }

        get maxDate() {
            return this.maxDP.getDateValue();
        }

        set maxDate(date) {
            this.maxDP.setDateValue(date);
            this.minDP.setMaxDate(date);
        }
    }

    customElements.define('sap-date-picker-styling', DatePickerAps);
})();