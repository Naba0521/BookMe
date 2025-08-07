import Link from "next/link";
import { Company, Employee } from "./CompanyTypes";

export const BusinessSection = ({ company }: { company: Company }) => {
  return (
    <div>
      <section className="relative bg-white text-black px-4 w-full">
        <div className="max-w-7xl mx-auto flex flex-col items-center space-y-12">
          <h1
            className="text-4xl md:text-6xl font-bold text-center"
            style={{
              background:
                "linear-gradient(to right, #000000 0%, #3B82F6 52%, #1D4ED8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Манай хамт олон
          </h1>

          <div className="w-32 h-1 bg-black" />

          <div className="flex flex-wrap justify-center gap-10">
            {company.employees?.map((employee: Employee) => (
              <div
                key={employee._id}
                className="w-[340px] rounded-xl overflow-hidden backdrop-blur-lg border border-white/10 transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background:
                    "radial-gradient(50% 50% at 100% 0%, #ffffff1a, #ffffff0d 36%, transparent), radial-gradient(125% 125% at 50% 10%, #000A17 65%, #007FFF 100%)",
                }}
              >
                <img
                  className="w-full h-[400px] object-cover rounded-t-xl"
                  src={employee.profileImage}
                  alt={employee.employeeName}
                />
                <div className="px-4 py-3 text-center space-y-1">
                  <h3
                    className="text-xl font-bold"
                    style={{
                      background:
                        "linear-gradient(to right, #FFFFFF 0%, #BBDEFB 52%, #2196F3 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {employee.employeeName}
                  </h3>
                  <p className="text-white/70 text-sm min-h-[40px]">
                    {employee.description}
                  </p>
                  <Link href={`/company/${company.companyName}/order`}>
                    <button className="mt-1 px-4 py-2 cursor-pointer rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold hover:from-blue-500 hover:to-blue-700 transition">
                      Цаг захиалах
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
