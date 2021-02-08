var jwt = require('jsonwebtoken');
export default function ({ redirect }) {
  const token = localStorage.getItem('access_token');
  if (!!token) {
    const decodedToken = jwt.decode(token);
    if (
      decodedToken.scope.includes('AGENT') ||
      decodedToken.scope.includes('ADMIN') ||
      decodedToken.scope.includes('CLERK')
    ) {
      return;
    }
    return redirect('/');
  }
  return redirect('/');
}
