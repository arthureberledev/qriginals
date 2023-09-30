import Image from "next/image";

import backgroundImage from "~/images/warrior-princess.png";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row min-h-full  bg-[#fcfffc]">
      <div className="flex basis-full lg:basis-1/2 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-48 2xl:px-64">
        {props.children}
      </div>
      <div className="relative hidden w-0 basis-1/2 lg:block">
        <div className="bg-gray-100 absolute inset-0 h-full w-full" />
        <Image
          fill
          priority
          src={backgroundImage}
          sizes="(min-width: 1024px) 50vw, 0vw"
          className="absolute inset-0 h-full w-full object-cover"
          alt="QR Code Art - by Qriginals.com"
        />
      </div>
    </div>
  );
}
