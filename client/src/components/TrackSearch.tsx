
interface Track {
    artist: string;
    title: string;
    uri: string;
    albumUrl: string;
    album: string;
    albumLink: string;
    trackId: string;
}

interface Props {
    track: Track;
    chooseTrack: ()=>void;
    addTrack: (track: Track)=>void
}

function TrackSearch({ track, chooseTrack, addTrack } : Props) {
    function handleClick() {
        chooseTrack();
        addTrack(track);
    }

    return(
        <div style={{cursor: "pointer"}} onClick={handleClick} className="w-100 d-flex my-2 text-white align-items-center">
            <img className="col col-1" src={track.albumUrl} style={{height: 64, width: 64}} />
            <div className="p-2 ps-3 col col-6">
                <div style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{track.title}</div>
                <div className="text-light fw-lighter">{track.artist}</div>
            </div>
            <div className="col col-5 ps-3">{track.album}</div>
        </div>
    )
}

export default TrackSearch;