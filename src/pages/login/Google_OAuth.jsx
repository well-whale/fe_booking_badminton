import { GoogleLogin } from '@react-oauth/google';

function GoogleOAuth() {
  return (
    <GoogleLogin
      onSuccess={credentialResponse => {
        console.log(credentialResponse);
      }}
      onError={() => {
        console.log('Login Failed');
      }}
    />
  );
}

export default GoogleOAuth;