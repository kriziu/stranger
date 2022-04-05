export const createNewStream = (
  oldStream: MediaStream | null,
  newStream = new MediaStream()
) => {
  if (!oldStream) return newStream;

  const trackToAdd = newStream.getVideoTracks()[0];

  if (trackToAdd) {
    oldStream.getTracks().forEach((track) => track.stop());
    if (oldStream.getVideoTracks()[0])
      oldStream.removeTrack(oldStream.getVideoTracks()[0]);
    oldStream.addTrack(trackToAdd);
  } else {
    oldStream.getTracks().forEach((track) => track.stop());
    oldStream.removeTrack(oldStream.getVideoTracks()[0]);
  }

  return oldStream;
};
