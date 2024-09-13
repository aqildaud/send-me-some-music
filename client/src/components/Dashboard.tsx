import Auth from "../utils/Auth";
import { useEffect, useState } from "react";
import spotifyWebApi from 'spotify-web-api-node'
import TrackSearch from "./TrackSearch";
import Playlist from "./Playlist";
import Player from "./Player";

interface Props{
    code: any
}

interface Track {
    artist: string;
    title: string;
    uri: string;
    albumUrl: string;
    album: string;
    albumLink: string;
    trackId: string;
}

interface PlaylistData {
    id: string;
    name: string;
    owner: string;
    totalSongs: number;
    albumImage: string;
    tracks: { name: string; artist: string; album: string; trackId: string; trackUri: string; }[];
}

const spotifyApi = new spotifyWebApi({
    clientId: "6e57fb69b21348c38cc8da92867eebbc"
})

function Dashboard({ code } : Props) {
    const accessToken = Auth(code);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState<Track[]>([]);
    const [position, setPosition] = useState(0);
    const [playlist, setPlaylist] = useState<PlaylistData>({id: "", name: "", owner: "", totalSongs: 0, albumImage: "", tracks: []});
    const [trackUri, setTrackUri] = useState("");

    function chooseTrack() {
        setSearch("");
    }

    function handlePlay(trackUri: any){
        setTrackUri(trackUri);
    }

    function getPlaylist() {
        spotifyApi.getPlaylist('4wxnQSsX1OPiHhv9QAuySC')
        .then(data => {
            if (!data || !data.body) return;
    
            setPosition(data.body.tracks.total);
            setPlaylist({
                id: data.body.id,
                name: data.body.name,
                owner: data.body.owner?.display_name || "",
                totalSongs: data.body.tracks.total,
                albumImage: data.body.images[0].url,
                tracks: data.body.tracks?.items.map(item => ({
                    trackId: item.track?.id || "",
                    name: item.track?.name || "",
                    album: item.track?.album.name || "",
                    artist: item.track?.artists.map(artist => artist.name).join(", ") || "",
                    trackUri: item.track?.uri || ""
                }))
            });
        })
        .catch(error => {
            if(error.statusCode === 429) {
                const retryAfter = error.headers['retry-after'];
                console.log('Rate limit hit. Retrying after ' + retryAfter + ' seconds');
                setTimeout(() => retryAfter * 1000);
            } else console.error("Error fetching playlist:", error);
        });
    }

    function addTrack(track: Track){
        if(!accessToken) return;
        const checkTrack = playlist.tracks.some(item => item.trackId === track.trackId);
        if(checkTrack) { console.log("Track is already in the playlist"); return; }
        spotifyApi.addTracksToPlaylist('4wxnQSsX1OPiHhv9QAuySC', [`spotify:track:${track.trackId}`], {position: position})
        .then(() => {
            console.log("Added to send me some music");
            getPlaylist();
        })
        .catch(error => {
            if(error.statusCode === 429){
                const retryAfter = error.headers['retry-after'];
                console.log(`Rate limit hit. Retrying after ${retryAfter} seconds.`);
                setTimeout(() => addTrack(track), retryAfter * 1000);
            } else {
                console.error("Error adding track to playlist:", error);
            }    
        });
    }
    
    //set access token
    useEffect(() => {
        if(!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken]);

    //get playlist
    useEffect(() => {
        if(!accessToken) return;
        getPlaylist();
    }, [accessToken])

    //search tracks
    useEffect(() => {
        if(!accessToken) return;
        if(!search) return setSearchResults([]);

        let cancel = false;
        spotifyApi.searchTracks(search)
        .then(res => {
            if(cancel) return;
            setSearchResults(
                res.body.tracks?.items.map(track => {
                    const smallestAlbumImage = track.album.images.reduce(
                        (smallest, image) => {
                            if (image.height && (!smallest.height || image.height < smallest.height)) return image
                            return smallest;
                            
                        },
                        track.album.images[0]
                    );
                    return {
                        artist: track.artists[0].name,
                        title: track.name,
                        uri: track.uri,
                        albumUrl: smallestAlbumImage.url,
                        album: track.album.name,
                        albumLink: track.album.external_urls.spotify,
                        trackId: track.id
                    }
                }) || []
            )
        })
        return () => { cancel = true }
    }, [search, accessToken, spotifyApi]);



    return (
        <>
            <div>
                <input className="w-100 border-0 border-bottom ps-1 text-white" style={{outline: "none", backgroundColor: "transparent"}}
                type="search" placeholder="send me some music" value={search} onChange={e => setSearch(e.target.value)} />
                <div>
                    {searchResults.length ? (
                        searchResults.map(track => <TrackSearch track={track} key={track.uri} chooseTrack={chooseTrack} addTrack={addTrack}/>)
                    ) : <Playlist playlist={playlist} playTrack={handlePlay} /> }
                </div>
                <div className="position-absolute bottom-0 start-50 translate-middle-x" style={{width: "576px"}}>
                    <Player trackUri={trackUri} accessToken={accessToken} />
                </div>
            </div>
        </>
    )   
}

export default Dashboard;