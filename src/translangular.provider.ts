interface IOpts {
  supported: string[];
  dynamic: boolean;
  default: string;
}

interface IRootScope extends ng.IRootScopeService {
  localeId: string;
}

/** @ngInject */
export class TranslangularProvider {

  private supported: string[] = ['en-us'];
  private dynamic: boolean = true;
  private default: string = 'en-US';

  config(opts: IOpts) {
    this.supported = opts.supported;
    this.dynamic = opts.dynamic;
    this.default = opts.default;
  }

  /** @ngInject */
  $get(Restangular: restangular.IService, tmhDynamicLocale, $rootScope: IRootScope, constants) {

    var Translangular = function(opts: IOpts) {

      this.supported = opts.supported;
      this.dynamic = opts.dynamic;
      this.default = opts.default;

      this.resolved = false;

      this.set = (lang: string) => {

        if (this.resolved && this.lang == lang) { return; }

        if (this.supported.indexOf(lang) === -1) {
          lang = lang.split('-')[0];
          if (this.supported.indexOf(lang) === -1) {
            lang = this.default;
          }
        }

        tmhDynamicLocale.set(lang.toLowerCase());

        this.resolved = false;
        this.promise = Restangular.oneUrl('terms', constants.baseUrl + '/assets/terms/' + lang + '.json').get();

        this.promise.then((resources) => {
          this.resolved = true;
          this.resources = resources;
          $rootScope.localeId = lang;
        });

        this.lang = lang;

      };

      let lang = (navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage));

      $rootScope.localeId = lang; // Prevent second filter on load.
      this.set(lang);

    }

    return new Translangular({
      supported: this.supported,
      dynamic: this.dynamic,
      default: this.default
    });

  }
}
