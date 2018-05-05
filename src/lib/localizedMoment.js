import moment from 'moment';
import I18n from 'react-native-i18n';

const localizedMoment = () => {
  console.log('RN - locale', I18n.currentLocale());
  // currently only supports es and en
  if (I18n.currentLocale() === 'es') {
    return moment().locale('es', require('moment/locale/es'));
  }

  return moment().locale('en');
};

export default localizedMoment;
