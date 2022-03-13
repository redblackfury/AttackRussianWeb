import humanFormat from 'human-format';

const humanNumberFormat = (value) => humanFormat(value);

const humanTimeFormat = (value) => {
  const o = new Intl.DateTimeFormat('ua', {
    timeStyle: 'short',
  });
  return o.format(value);
};

const intervals = [
  { label: 'year', seconds: 31536000 },
  { label: 'month', seconds: 2592000 },
  { label: 'd', seconds: 86400 },
  { label: 'h', seconds: 3600 },
  { label: 'm', seconds: 60 },
  { label: 's', seconds: 1 },
];

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const interval = intervals.find((i) => i.seconds < seconds);
  const count = Math.floor(seconds / interval.seconds);
  return `${count} ${interval.label}`;
}

export { humanNumberFormat, humanTimeFormat, timeAgo };
