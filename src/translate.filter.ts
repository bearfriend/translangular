interface ITranslateData {
  _id: string;
  _plural?: string;
  _offset?: number;
  _select?: string;
  _detail?: string;
  [propName: string]: <any>{};
}

/** @ngInject */
export function TranslateFilter(Translangular, $locale) {

  return function(str, localeId, data: ITranslateData) {

    var res = Translangular.resources['$res[ '+str+' ]'];

    if (!res) {
      console.error('Language resource "'+str+'" not found.');
      return;
    }

    var resText = res['TRANSLATE'];

    if (data) {

      if ('index' in data) {
        //resText = res[data['$i']] && res[data['$i']]['TRANSLATE'];
        resText = res[data.index]['TRANSLATE'];
      }

      if ('plural' in data) {
        var plurals = resText;
        var count = (data.plural || 0 )-(data.offset || 0);

        resText =
        plurals['='+count] // try exact match (i.e. "=1", "=2")
        || plurals[$locale.pluralCat(count)] // try plural category (i.e. "few", "many")
        || plurals.other;
      }

      if (data.select) {
        var selects = resText;

        resText = selects[data.select] || selects.other;
      }
    }

    if (Translangular.dynamic && !localeId) {
      console.warn("Translate filter did not receive a 'this' (scope) argument, but dynamic locales are enabled. This resource will not be updated if the locale is changed dynamically.");
    }

    return resText
    .replace(/(\{.*?\})/g,
    function(exp) {
      return exp
      .slice(1,-1)
      .trim()
      .split('.')
      .reduce((o,i) => o[i], data.bindings);
    });
  };
}

export { TranslateFilter };
