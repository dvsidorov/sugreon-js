
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
         * @param extra
         * @param media
         * @param clean
         */
        this.getCssInfo = function (target, storage, extra, media, clean) {

            this.clean = clean;
            this.media = media;
            this.extra = extra;

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


        /**
         * Method for clean selector text, if he has
         * some word in list of excluded.
         * @param selector_text
         * @returns {*}
         */
        this.cleanSelector = function (selector_text) {

            if (!selector_text) { return selector_text }

            var present = false;
            var obj = this;
            var search_elements = [];
            $.each([].concat(obj.pseudo_elements).concat(obj.pseudo_classes),
                function (index, element) {
                    search_elements = search_elements.concat(':' + element);
                    search_elements = search_elements.concat('::' + element);
                }
            );
            search_elements = search_elements.concat(this.plugin_action_classes);
            search_elements = search_elements.concat(this.extra);
            $.each(search_elements, function (index, ps_element) {
                var regexp = new RegExp('\\w+'+ps_element, 'gi');

                if (selector_text.match(regexp)) {
                    selector_text = selector_text.replace(ps_element, '');
                    present = true;
                }
            });

            if (!present){
                return null;
            }
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
                if (sheet.type == 'text/css') {
                    obj.styleSheetAnalyze(sheet, html_target, storage)
                }
            });
            return true;
        };

        /**
         * Method for GET all rules
         * for HTML Target element
         * on StyleSheet
         * @param sheet
         * @param html_target
         * @param storage
         * @returns {boolean}
         */
        this.styleSheetAnalyze = function (sheet, html_target, storage) {
            var obj = this;
            $.each (sheet.rules, function (index, rule) {
                obj.ruleAnalyze(rule, html_target, storage)
            });
        };

        /**
         * Method for GET all rules
         * for HTML Target element
         * on StyleSheet Rule
         * @param rule
         * @param html_target
         * @param storage
         * @returns {boolean}
         */
        this.styleRuleAnalyze = function (rule, html_target, storage) {
            var selector_text = rule.selectorText;

            if (this.clean) {
                selector_text = this.cleanSelector(selector_text);
            }

            if (!selector_text) {
                return false;
            }
            var element_s = $(selector_text);

            var media = null;
            if (rule.parentRule) {
                media = rule.parentRule.media
            }

            if ((this.media && !media) ||
                (!this.media && media)) {
                return false
            }

            if (this.elementConsist(element_s, html_target)) {
                storage.push({
                    'href': rule.parentStyleSheet.href,
                    'cssText': rule.cssText,
                    'media': media
                })
            }
        };

        /**
         * Method for GET all rules
         * for HTML Target element
         * on Import Rule
         * @param rule
         * @param html_target
         * @param storage
         * @returns {boolean}
         */
        this.importRuleAnalyze = function (rule, html_target, storage) {

            var obj = this;
            $.each (rule.styleSheet.rules, function (index, rule) {
                obj.ruleAnalyze(rule, html_target, storage)
            });
        };

        /**
         * Method for GET all rules
         * for HTML Target element
         * on Media Rule
         * @param rule
         * @param html_target
         * @param storage
         * @returns {boolean}
         */
        this.mediaRuleAnalyze = function (rule, html_target, storage) {

            var obj = this;
            $.each (rule.cssRules, function (index, rule) {
                obj.ruleAnalyze(rule, html_target, storage)
            });
        };

        /**
         * Method for GET all rules
         * for HTML Target element
         * @param rule
         * @param html_target
         * @param storage
         * @returns {boolean}
         */
        this.ruleAnalyze = function (rule, html_target, storage) {

            if (rule.type == 1) {
                this.styleRuleAnalyze(rule, html_target, storage)
            }
            if (rule.type == 3) {
                this.importRuleAnalyze(rule, html_target, storage)
            }
            if (rule.type == 4) {
                this.mediaRuleAnalyze(rule, html_target, storage)
            }
        };

    };

}) (jQuery, jBus);