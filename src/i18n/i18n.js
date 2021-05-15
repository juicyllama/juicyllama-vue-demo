import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n) 

export default new VueI18n({
  locale: 'en', // set default locale
  fallbackLocale: 'en',
  silentTranslationWarn: true,
  messages: {
en: {
	Starterkit : 'Starterkit',
	HellowWorld : 'HellowWorld',

},
fr: {
	Starterkit : 'Kit de démarrage',
	HellowWorld : 'Bonjour le monde',

},
ch: {
	Starterkit : '入门套件',
	HellowWorld : '你好，世界 ',
},
gr: {
	Starterkit : 'Starter-Kit',
	HellowWorld : 'Hallo Welt',
},
 
	
},

})