const CustomVideo = ({
  stream,
  active = false,
}: {
  stream: MediaStream;
  active?: boolean;
}) => {
  return (
    <>
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
        className={`h-full w-full cursor-pointer ${!active && 'object-cover'}`}
      />
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
    </>
  );
};

export default CustomVideo;
