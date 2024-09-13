
interface Tracks {
    name: string;
    artist: string;
    album: string;
    trackId: string;
    trackUri: string;
}

interface Playlist {
    id: string;
    name: string;
    owner: string;
    totalSongs: number; 
    albumImage: string;
    tracks: Tracks[]; 
}

interface Props {
    playlist: Playlist;
    playTrack: (trackUri: string) => void;
}

function Playlist({playlist, playTrack} : Props) {
    return (
        <>
            <div className="d-flex overflow-x-hidden w-100 mt-3">
                <div className="col col-3 d-flex justify-content-center">
                    <img src={playlist.albumImage} alt="" style={{ maxWidth: "128px" }} />
                </div>
                <div className="text-white col d-flex flex-column justify-content-end px-2">
                    <a href="https://open.spotify.com/playlist/4wxnQSsX1OPiHhv9QAuySC?si=72fcb56674a44a98" target="_blank" className="m-0 fs-3 fw-bolder">{playlist.name}</a>
                    <p className="m-0 text-sub" style={{ fontSize: 14 }}>
                        Created by <strong className="text-white">{playlist.owner}</strong>,{" "}
                        {playlist.totalSongs} songs
                    </p>
                </div>
            </div>
            <div className="d-flex flex-column overflow-x-hidden w-100 mt-1">
                {playlist.tracks.map((track, index) => (
                <p className="m-0 text-white" key={index}>
                    <span className="text-decoration-underline" onClick={() => playTrack(track.trackUri)} style={{cursor: "pointer", color: "#ffec45"}}>{track.name}</span> by <span style={{color: "#58ff45"}}>{track.artist}</span> <span style={{color: "#f545ff"}}>{track.album}</span>
                </p>
                ))}
            </div>
        </>
    )
}

export default Playlist;