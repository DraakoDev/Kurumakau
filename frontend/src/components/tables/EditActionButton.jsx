export const EditActionButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        px-4
        py-2
        rounded-xl
        bg-amber-500
        hover:bg-amber-600
        text-white
        text-sm
        font-semibold
        transition
      "
    >
      Editar
    </button>
  );
};
