import Image from "next/image";

const Grid = () => {
  return (
    <Image
      src={"/assets/grid.png"}
      width={500}
      height={500}
      alt="grid"
      className="absolute -top-16 left-0 right-0 -z-10 object-contain w-full h-full object-top pointer-event-none lg:opacity-50"
    />
  );
};

export default Grid;
