export const createNewStream = (
  oldStream: MediaStream | null,
  newStream = new MediaStream()
) => {
  if (!oldStream) return newStream;

  const trackToAdd = oldStream.getAudioTracks()[0];

  if (trackToAdd) {
    newStream.addTrack(trackToAdd);
    oldStream.removeTrack(trackToAdd);
  }

  oldStream.getTracks().forEach((track) => track.stop());

  return newStream;
};
