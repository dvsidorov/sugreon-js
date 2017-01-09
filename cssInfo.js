
window.jQuery = window.jQuery || {};
window.jBus = window.jBus || {};


(function ($, class_bus) {

    'use strict';

    class_bus.CssInfoAnalyzer = function () {

        this.pseudo_elements = [
            'before',
            'after',
            'first-letter',
            'first-line',
            'selection'
        ];
        this.pseudo_classes = [
            'active',
            'checked',
            'disabled',
            'empty',
            'enabled',
            'first-child',
            'first-of-type',
            'focus',
            'hover',
            'in-range',
            'invalid',
            'last-child',
            'last-of-type',
            'link',
            'only-of-type',
            'only-child',
            'optional',
            'out-of-range',
            'read-only',
            'read-write',
            'required',
            'root',
            'target',
            'valid',
            'visited'
        ];
        this.plugin_action_classes = [
            '.active'
        ];

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
         * Method return True, if find element
         * in Array of elements
         * @param element_s
         * @param html_target
         * @returns {boolean}
         */
        this.elementConsist = function (element_s, html_target) {

            var consist = false;
            $.each(element_s, function (index, html_element) {
                if (html_element == html_target) {
                    consist = true;
                    return false;
                }
            });
            return consist;
        };



        this.cleanSelector = function (selector_text) {

            if (!selector_text) { return selector_text };

            var obj = this;
            var search_elements = [];
            $.each([].concat(obj.pseudo_elements).concat(obj.pseudo_classes),
                function (index, element) {
                    search_elements = search_elements.concat(':' + element);
                    search_elements = search_elements.concat('::' + element);
                }
            );
            search_elements = search_elements.concat(this.plugin_action_classes);
            $.each(search_elements, function (index, ps_element) {
                var regexp = new RegExp('\\w+'+ps_element, 'gi');

                if (selector_text.match(regexp)) {
                    selector_text = selector_text.replace(ps_element, '');
                }
            });
            return selector_text;
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

            var obj = this;
            $.each(sheets, function (index, sheet) {
                $.each (sheet.rules, function (index, item) {

                    var selector_text = item.selectorText;
                    selector_text = obj.cleanSelector(selector_text);

                    var element_s = $(selector_text);

                    if (obj.elementConsist(element_s, html_target)) {
                        storage.push({
                            'href': sheet.href,
                            'cssText': item.cssText
                        })
                    }
                });
            });
            return true;

        };
    };

}) (jQuery, jBus);