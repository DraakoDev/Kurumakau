export const DeleteActionButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        px-4
        py-2
        rounded-xl
        bg-red-500
        hover:bg-red-600
        text-white
        text-sm
        font-semibold
        transition
      "
    >
      Eliminar
    </button>
  );
};
