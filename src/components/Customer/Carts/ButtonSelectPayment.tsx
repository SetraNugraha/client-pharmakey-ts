interface Props {
  handleSelectedMethod: () => void;
  isSelected: boolean;
  title: string;
  icon: string;
}

export const ButtonSelectPayment = ({ title, icon, isSelected, handleSelectedMethod }: Props) => {
  return (
    <button
      onClick={handleSelectedMethod}
      className={`w-1/2 flex items-center gap-x-3 py-3 px-3 bg-white rounded-[16px] hover:outline-none hover:ring-2 hover:ring-[#F39D84] ${
        isSelected && "ring-2 ring-primary"
      }`}
    >
      <img src={`assets/img/${icon}.png`} alt="transfer" className="p-2 bg-[#98B1FC] rounded-full" />
      <p className="font-semibold">{title}</p>
    </button>
  );
};
