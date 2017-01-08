
window.jQuery = window.jQuery || {};
window.jBus = window.jBus || {};


(function ($, class_bus) {

    class_bus.CssInfoAnalyzer = function () {

        /**
         * Method creating list of rules
         * for target DOM element
         * @param target
         * @param storage
         */
        this.getCssInfo = function (target, storage) {

            var html_target = $(target)[0];

            var sheets = this.getStyleSheets ();
            this.getRules(sheets, html_target, storage);

        };

        /**
         * Method for GET all stylesheets
         * in HTML Document
         * @returns {Stylesheet[]}
         */
        this.getStyleSheets = function () {
            return document.styleSheets;
        };

        /**
         * Method for GET all rules
         * for HTML Target element
         * @param sheets
         * @param html_target
         * @param storage
         * @returns {boolean}
         */
        this.getRules = function (sheets, html_target, storage) {

            $.each(sheets, function (index, sheet) {
                $.each (sheet.rules, function (index, item) {
                    var element_s = $(item.selectorText);
                    $.each(element_s, function (index, html_element) {
                        if (html_element == html_target) {
                            storage.push({
                                'href': sheet.href,
                                'cssText': item.cssText
                            })
                        }
                    })
                });
            });
            return true;

        };
    };

}) (jQuery, jBus);