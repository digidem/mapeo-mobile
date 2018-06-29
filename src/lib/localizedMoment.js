import moment from 'moment';
import I18n from 'react-native-i18n';

const localizedMoment = date => {
  // currently only supports es and en
  if (I18n.currentLocale().indexOf('es') !== -1) {
    return moment(date).locale('es', require('moment/locale/es'));
  }

  return moment(date).locale('en');
};

export default localizedMoment;
