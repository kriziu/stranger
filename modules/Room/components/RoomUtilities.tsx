const btnClass = 'btn btn-secondary w-36 px-0 text-center font-normal';

const RoomUtilities = () => {
  return (
    <div className="flex flex-1 flex-col items-center space-y-3">
      <h3 className="-mb-2 text-center text-xl font-bold">Utilities</h3>
      <button className={`${btnClass}`}>Video chat</button>
      <button
        className={`${btnClass} bg-green-400 text-black hover:bg-green-500 active:bg-green-400`}
      >
        Audio chat
      </button>
      <button className={`${btnClass}`}>Share screen</button>
      <button className={`${btnClass}`}>Send image</button>
    </div>
  );
};

export default RoomUtilities;
