export function getISODate(indianDate) {
  let d = indianDate.match("^(.*?)/(.*?)/(.*?)$");
  let month = d[2];
  let day = d[1];
  let year = d[3];
  return `${year}-${month}-${day}`;
}
