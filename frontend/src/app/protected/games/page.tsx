// a component for the games page display welcome to games
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
export default function Games() {
  return (
    <>
      {/* update here was added w-full may can make some issues !!!!! */}
      <div className="h-screen flex items-center min-w-[200px] w-full overflow-x-auto">
        <Sidebar />
        <Navbar />
        <main
          className="flex flex-row items-center justify-center relative overflow-x-hidden
                            xl:pl-20 2xl:pl-24 w-full
                            h-[calc(100%-130px)]
                            xl:h-[calc(100%-75px)]
                            2xl:h-[calc(100%-85px)]
                            2xl:mt-[67px] xl:mt-[60px]
                        "
        >
          <div className="flex flex-col items-center justify-center w-full h-full text-white">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to the Games Page!
            </h1>
            <p className="text-lg">Here you can find and play various games.</p>
          </div>
        </main>
      </div>
    </>
  );
}
