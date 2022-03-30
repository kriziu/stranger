const btnClass =
  'btn btn-secondary w-24 sm:w-36 px-0 text-center font-semibold text-sm md:text-base';

const RoomUtilities = () => {
  return (
    <div>
      <h3 className="-mb-2 block text-xl font-bold md:hidden">Utilities</h3>
      <div className="flex flex-1 flex-wrap items-center justify-center space-y-3 space-x-2 sm:flex-nowrap md:flex-col">
        <h3 className="-mb-2 hidden text-center text-xl font-bold md:block">
          Utilities
        </h3>
        <button className={`${btnClass}`}>Video chat</button>
        <button
          className={`${btnClass} bg-green-400 text-black hover:bg-green-500 active:bg-green-400`}
        >
          Audio chat
        </button>
        <button className={`${btnClass}`}>Share screen</button>
        <button className={`${btnClass}`}>Send image</button>
      </div>
    </div>
  );
};

export default RoomUtilities;
