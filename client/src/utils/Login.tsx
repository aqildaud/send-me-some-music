const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=6e57fb69b21348c38cc8da92867eebbc&response_type=code&redirect_uri=http://localhost:5173&scope=streaming%20user-read-private%20user-read-email%20playlist-read-private%20user-modify-playback-state%20user-read-playback-state%20playlist-modify-public";

function Login() {
    window.location.href = AUTH_URL;
    return <></>
}

export default Login;