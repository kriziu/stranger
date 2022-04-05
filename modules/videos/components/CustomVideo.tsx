/* eslint-disable import/no-cycle */
import { AiOutlineExpandAlt } from 'react-icons/ai';
import { BiMove } from 'react-icons/bi';

import { useFullscreen } from '../context/fullscreenVideoContext';
import { useMovableVideos } from '../context/movableVideosContext';

interface Props {
  stream: MediaStream;
  utilityBtns?: boolean;
  isFullscreen?: boolean;
}

const CustomVideo = ({
  stream,
  utilityBtns = false,
  isFullscreen = false,
}: Props) => {
  const { addMovableVideo } = useMovableVideos();

  const setFullscreenVideo = useFullscreen();

  return (
    <>
      {utilityBtns && (
        <>
          <button
            className="btn btn-primary absolute left-5 top-5 z-10 p-2"
            onClick={(e) => {
              e.stopPropagation();
              addMovableVideo(stream);
            }}
          >
            <BiMove />
          </button>
          <button
            className="btn btn-primary absolute right-5 top-5 z-10  p-2"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenVideo(stream);
            }}
          >
            <AiOutlineExpandAlt />
          </button>
        </>
      )}

      <video
        ref={(video) => {
          if (video) {
            // eslint-disable-next-line no-param-reassign
            video.srcObject = stream;

            video.addEventListener('loadedmetadata', () => {
              video.play();
            });
          }
        }}
        autoPlay
        playsInline
        muted
        className={`h-full
        w-full ${!isFullscreen && 'object-cover'}`}
      />

      {!isFullscreen && (
        <audio
          ref={(audio) => {
            if (audio) {
              // eslint-disable-next-line no-param-reassign
              audio.srcObject = stream;

              audio.addEventListener('loadedmetadata', () => {
                audio.play();
              });
            }
          }}
        />
      )}
    </>
  );
};

export default CustomVideo;
