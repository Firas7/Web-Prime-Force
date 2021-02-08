export default function ({ redirect }) {
  const token = localStorage.getItem('access_token');
  if (!!token) {
    return;
  }
  return redirect('/');
}
