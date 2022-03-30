import { colors } from '@/common/utils/colors';

interface Props {
  children: string;
  color: ColorType;
}

const Badge = ({ color, children }: Props) => {
  const bgColor = colors.get(color) || 'bg-gray-400';

  return (
    <div
      className={`${bgColor} w-max rounded-full p-1 px-3 text-sm font-semibold text-black`}
    >
      {children}
    </div>
  );
};

export default Badge;
