import Image from "next/image";

const Tache = ({ className }) => {
  return (
    <div>
      <Image
        src="/assets/blue.png"
        alt="elipse-blue-blur"
        width={700}
        height={700}
        className={`absolute ${className} z-0 pointer-events-none`}
      />
    </div>
  );
};

export default Tache;
