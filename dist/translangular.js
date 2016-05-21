/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../typings/index.d.ts" />
	//import { config } from './translangular.config.dev';
	//import { runBlock } from './translangular.run';
	//import '../app/services/terms/terms.service';
	var translangular_provider_1 = __webpack_require__(1);
	var translate_filter_1 = __webpack_require__(2);
	var translangular;
	(function (translangular) {
	    'use strict';
	    angular.module('translangular', ['restangular', 'angular.filter', 'tmh.dynamicLocale'])
	        .config(['tmhDynamicLocaleProvider', function (tmhDynamicLocaleProvider) {
	            tmhDynamicLocaleProvider.localeLocationPattern('https://s.brightspace.com/lib/angular/1.4.9/i18n/angular-locale_{{locale}}.js');
	        }])
	        .provider('Translangular', translangular_provider_1.TranslangularProvider)
	        .filter('translate', translate_filter_1.TranslateFilter);
	})(translangular || (translangular = {}));
	//# sourceMappingURL=translangular.js.map

/***/ },
/* 1 */
/***/ function(module, exports) {

	/** @ngInject */
	var TranslangularProvider = (function () {
	    function TranslangularProvider() {
	        this.supported = ['en-us'];
	        this.dynamic = true;
	        this.default = 'en-US';
	    }
	    TranslangularProvider.prototype.config = function (opts) {
	        this.supported = opts.supported;
	        this.dynamic = opts.dynamic;
	        this.default = opts.default;
	    };
	    /** @ngInject */
	    TranslangularProvider.prototype.$get = function (Restangular, tmhDynamicLocale, $rootScope, constants) {
	        var Translangular = function (opts) {
	            this.supported = opts.supported;
	            this.dynamic = opts.dynamic;
	            this.default = opts.default;
	            this.resolved = false;
	            this.set = function (lang) {
	                var _this = this;
	                lang = lang && lang.toLowerCase();
	                if (this.supported.indexOf(lang) === -1) {
	                    lang = lang.split('-')[0];
	                    if (this.supported.indexOf(lang) === -1) {
	                        lang = this.default;
	                    }
	                }
	                tmhDynamicLocale.set(lang);
	                this.resolved = false;
	                this.promise = Restangular.oneUrl('terms', constants.baseUrl + '/assets/terms/' + lang + '.json').get();
	                this.promise.then(function () {
	                    $rootScope.localeId = lang;
	                    _this.resolved = true;
	                });
	                this.terms = this.promise.$object;
	            };
	            this.lang = (navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage));
	            this.set(this.lang);
	        };
	        return new Translangular({
	            supported: this.supported,
	            dynamic: this.dynamic,
	            default: this.default
	        });
	    };
	    TranslangularProvider.prototype.$get.$inject = ["Restangular", "tmhDynamicLocale", "$rootScope", "constants"];
	    return TranslangularProvider;
	})();
	exports.TranslangularProvider = TranslangularProvider;
	//# sourceMappingURL=translangular.provider.js.map

/***/ },
/* 2 */
/***/ function(module, exports) {

	/** @ngInject */
	function TranslateFilter(Translangular, $locale) {
	    return function (str, data) {
	        var term = Translangular.terms[str];
	        if (!term) {
	            console.error('Term "' + str + '" not found.');
	            return;
	        }
	        if (data) {
	            if (data._desc) {
	                term = term[data._desc];
	            }
	            else if (data._pluralize) {
	                var pluralize = 'pluralize:' + data._pluralize;
	                var offset = data._offset ? ', offset:' + data._offset : '';
	                var plurals = term[pluralize + offset];
	                term =
	                    plurals['=' + data[data._pluralize]] // try exact match (i.e. "=1", "=2")
	                        || plurals[$locale.pluralCat(data[data._pluralize])] // try plural category (i.e. "few", "many")
	                        || plurals.other;
	            }
	        }
	        // TODO: use a provider, package as module
	        if (Translangular.dynamicLocale && (!data || !data._id)) {
	            console.warn("Translate filter did not receive an '_id' property, and dynamicLocale is enabled. This term will not be updated if the locale is changed dynamically.");
	        }
	        return term
	            .replace(/(\{.*?\})/g, function (exp) {
	            return exp
	                .slice(1, -1)
	                .trim()
	                .split('.')
	                .reduce(function (o, i) { return o[i]; }, data);
	        });
	    };
	}
	TranslateFilter.$inject = ["Translangular", "$locale"];
	exports.TranslateFilter = TranslateFilter;
	exports.TranslateFilter = TranslateFilter;
	//# sourceMappingURL=translate.filter.js.map

/***/ }
/******/ ]);
//# sourceMappingURL=translangular.js.map