interface ITranslateData {
  _id: string;
  _pluralize?: string;
  _offset?: number;
  _select?: string;
  _detail?: string;
  [propName: string]: <any>{};
}

/** @ngInject */
export function TranslateFilter(Translangular, $locale) {

  return function(str,data: ITranslateData) {
    var term = Translangular.terms[str];


    if (!term) {
      console.error('Term "'+str+'" not found.');
      return;
    }

    if (data) {
      if (data._desc) {
        term = term[data._desc];
      }
      else if (data._pluralize) {
        var pluralize = 'pluralize:'+data._pluralize;
        var offset = data._offset ? ', offset:'+data._offset : '';
        var plurals = term[pluralize+offset];

        term =
        plurals['='+data[data._pluralize]] // try exact match (i.e. "=1", "=2")
        || plurals[$locale.pluralCat(data[data._pluralize])] // try plural category (i.e. "few", "many")
        || plurals.other
      }
    }

    // TODO: use a provider, package as module
    if (Translangular.dynamicLocale && (!data || !data._id)) {
      console.warn("Translate filter did not receive an '_id' property, and dynamicLocale is enabled. This term will not be updated if the locale is changed dynamically.");
    }

    return term
    .replace(/(\{.*?\})/g,
    function(exp) {
      return exp
      .slice(1,-1)
      .trim()
      .split('.')
      .reduce((o,i) => o[i], data);
    });
  };
}

export { TranslateFilter };
