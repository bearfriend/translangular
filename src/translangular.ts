/// <reference path="../typings/index.d.ts" />

//import { config } from './translangular.config.dev';
//import { runBlock } from './translangular.run';

//import '../app/services/terms/terms.service';

import { TranslangularProvider } from './translangular.provider';
import { TranslateFilter } from './translate.filter';



module translangular {
  'use strict';

  angular.module('translangular', ['restangular', 'angular.filter', 'tmh.dynamicLocale'])
    //.config(config)
    //.run(runBlock)
    .config(['tmhDynamicLocaleProvider', function(tmhDynamicLocaleProvider) {
      tmhDynamicLocaleProvider.localeLocationPattern('https://s.brightspace.com/lib/angular/1.4.9/i18n/angular-locale_{{locale}}.js');
    }])
    .provider('Translangular', TranslangularProvider)
    .filter('translate', TranslateFilter);

}
