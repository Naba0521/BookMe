import React from "react";
import ProfileCard from "./ProfileCard";

const team = [
  {
    name: "Naranbaatar",
    avatarUrl:
      "https://res.cloudinary.com/dgivvztkg/image/upload/v1754569543/IMG_0115_1_zp9cgm.jpg",
    title: "Team Lead",
    handle: "javicodes",
  },
  {
    name: "Amgalanbaatar",
    avatarUrl:
      "https://res.cloudinary.com/dgivvztkg/image/upload/v1754569543/IMG_0115_1_zp9cgm.jpg",
    title: "Software Engineer",
    handle: "javicodes",
  },
  {
    name: "Enkhzorig",
    avatarUrl:
      "https://res.cloudinary.com/dgivvztkg/image/upload/v1754569543/IMG_0115_1_zp9cgm.jpg",
    title: "Software Engineer",
    handle: "javicodes",
  },
];

const OurTeam = ({ id }: { id: string }) => {
  return (
    <section
      className="flex flex-col items-center gap-10 pt-20 pb-20 md:gap-20 lg:px-20 md:pb-40 md:pt-0"
      id={id}
    >
      <h4 className="text-4xl md:text-5xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-[#007fff]">
        Манай баг
      </h4>
      <div className="grid w-full grid-cols-2 gap-4 px-4 mx-auto md:grid-cols-2 lg:grid-cols-3 md:gap-8 sm:px-6 md:px-8 lg:px-20 max-w-7xl">
        {team.map((member, index) => (
          <div key={index} className="flex justify-center w-full px-2 md:px-0">
            <ProfileCard
              name={member.name}
              title={member.title}
              handle={member.handle}
              avatarUrl={member.avatarUrl}
              showUserInfo={false}
              enableTilt={true}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurTeam;
