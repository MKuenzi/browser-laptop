var MAX_INPUTS_HARD=200,MAX_INPUTS_SOFT=100;function LP_exceedInputsThreshold(c){if(!c)return!0;var f=MAX_INPUTS_HARD,d=MAX_INPUTS_SOFT;c=c.getElementsByTagName("input");var b=c.length;if(b>f)return verbose_log("EIT: hard threshold exceed"),!0;if(b<d)return!1;var f=0,a;for(a=0;a<b;a++)if(c[a]){var h=c[a].type;("text"==h||"passwd"==h)&&f++}return f>d?(verbose_log("EIT: soft threshold exceed"),!0):!1}var MAX_FORMS_HARD=20,MAX_FORMS_SOFT=10;
function LP_getFormsThreshold(c){function f(a){if(!a||"undefined"==typeof a.elements||5<=a.elements.length)return!1;for(var b=0;b<a.elements.length&&5>b;b++)if("hidden"!=a.elements[b].type)return!1;return!0}if(!c)return 0;var d=MAX_FORMS_HARD,b=MAX_FORMS_SOFT,a=formcacheget(c,"fakedoc","max-forms-threshold");if(null!=a)return a;var a=c.getElementsByTagName("form"),h=a.length;Checkpoint.assert(h<d,"page has too many forms");if(h>d)L(a[0].id+" "+f(a[0])),f(a[0])&&(f(a[1])&&f(a[d-1]))&&(d*=2);else if(h<
b)return formcacheset(c,"fakedoc","max-forms-threshold",b),b;var g=0,j=RegExp(lpgs("ff_loginform_regexp"),"i"),e;for(e=0;e<h&&e<d;e++)if(a[e]){c&&a[e]&&!a[e].disabled&&g++;if(e>b&&c&&a[e]&&!a[e].disabled){var k=a[e].id;if(j.exec(a[e].name)||j.exec(k))return formcacheset(c,"fakedoc","max-forms-threshold",d),d}if(e>d)break}if(g>b)return formcacheset(c,"fakedoc","max-forms-threshold",b+2),b+2;formcacheset(c,"fakedoc","max-forms-threshold",b);return b}
var MAX_FORM_ELEMENTS_HARD=500,MAX_FORM_ELEMENTS_SOFT=100;function LP_exceedFormElementsThreshold(c,f){if(!c||!f)return!0;var d=MAX_FORM_ELEMENTS_SOFT,b=f.elements,a=b.length;if(a>MAX_FORM_ELEMENTS_HARD)return verbose_log("EFET: hard threshold exceed"),!0;if(a<d)return!1;var h=0,g;for(g=0;g<a;g++)if(b[g]&&b[g]&&(!b[g].disabled&&"FIELDSET"!=b[g].tagName)&&"input"==b[g].tagName){var j=inputs[g].type;("text"==j||"passwd"==j)&&h++}return h>d?(verbose_log("EFET: soft threshold exceed"),!0):!1};