import SpotifyPlayer from "react-spotify-web-playback";

interface Props {
    accessToken: any;
    trackUri: any;
}

function Player({ accessToken, trackUri } : Props ) {
    if(!accessToken || !trackUri) return
    return(
        <SpotifyPlayer
            styles={{bgColor: "transparent", color: "white", trackArtistColor: "#d6d6d6", trackNameColor: "white", sliderColor: "#1afff0", sliderHandleColor: "white"}}
            token={accessToken}
            play={true}
            uris={trackUri}
            offset={0}
            hideAttribution={false}
        ></SpotifyPlayer>
    )
}

export default Player;
