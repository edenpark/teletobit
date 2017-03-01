import moment from 'moment';
import 'moment/locale/ko';

const timeAgo = (time) => {
    moment.locale('ko');
    return moment(time, 'x').fromNow();
}

export default timeAgo;
