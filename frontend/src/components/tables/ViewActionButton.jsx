export const ViewActionButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        px-4
        py-2
        rounded-xl
        bg-blue-500
        hover:bg-blue-600
        text-white
        text-sm
        font-semibold
        transition
      "
    >
      Ver
    </button>
  );
};
